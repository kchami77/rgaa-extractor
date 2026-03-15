#!/usr/bin/env python3
"""
RGAA JSON → Markdown RAG  v1.0
Lit les fichiers JSON officiels du dépôt DISIC/accessibilite.numerique.gouv.fr
et génère 106 fichiers Markdown (1 par critère) avec YAML front matter.

Sources JSON officielles :
  criteres.json    — critères, tests, conditions, cas particuliers, notes techniques
  methodologie.json — méthodologies de test (étapes numérotées)

Usage :
    pip install requests
    python3 rgaa_json_scraper.py -o ./rgaa_chunks
    python3 rgaa_json_scraper.py --criteres criteres.json --methodo methodologie.json -o ./rgaa_chunks
"""

import argparse
import json
import logging
import re
import sys
import time
from pathlib import Path

import requests

# ─── Configuration ────────────────────────────────────────────────────────────
BASE_RAW = "https://raw.githubusercontent.com/DISIC/accessibilite.numerique.gouv.fr/main/RGAA"
URL_CRITERES    = f"{BASE_RAW}/criteres.json"
URL_METHODOLOGIE = f"{BASE_RAW}/methodologies.json"
BASE_CRITERES_URL = "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests"
DEFAULT_OUT = "./rgaa_chunks"
TIMEOUT = 20
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; RGAA-RAG/1.0)"}

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s", datefmt="%H:%M:%S")
log = logging.getLogger("rgaa_json")


# ─── Fetch ────────────────────────────────────────────────────────────────────
def fetch_json(url: str) -> dict | list:
    log.info(f"  GET {url}")
    r = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
    r.raise_for_status()
    return r.json()


def load_json(path: str) -> dict | list:
    return json.loads(Path(path).read_text(encoding="utf-8"))


# ─── Nettoyage Markdown ───────────────────────────────────────────────────────
def clean_md(text: str) -> str:
    """Nettoie les liens Markdown internes vers le glossaire."""
    if not text:
        return ""
    # Remplace [terme](#ancre) → terme
    text = re.sub(r"\[([^\]]+)\]\(#[^\)]+\)", r"\1", text)
    # Nettoie les espaces multiples
    return re.sub(r" {2,}", " ", text).strip()


def render_item(item) -> str:
    """Rend un test RGAA.
    Structure réelle : liste où item[0] = question, item[1:] = conditions.
    """
    if isinstance(item, str):
        return clean_md(item)
    if isinstance(item, list) and len(item) > 0:
        question = clean_md(item[0])
        conditions = item[1:]
        if conditions:
            cond_block = "\n".join(f"- {clean_md(c)}" for c in conditions)
            return f"{question}\n\n{cond_block}"
        return question
    if isinstance(item, dict):
        # Cas imbriqué inattendu — rendu clé:valeur
        parts = []
        for k, v in item.items():
            parts.append(f"**{k}** : {render_item(v)}")
        return "\n".join(parts)
    return str(item)


# ─── Génération Markdown ──────────────────────────────────────────────────────
def critere_to_markdown(topic_num: int, topic_title: str,
                         critere_num: int, critere: dict,
                         methodologies: dict) -> str:
    cid = f"{topic_num}.{critere_num}"
    critere_url = f"{BASE_CRITERES_URL}#{cid}"
    tests = critere.get("tests", {})
    nb_tests = len(tests)

    # YAML front matter
    lines = [
        "---",
        f'critere_id: "{cid}"',
        f'thematique: "{clean_md(topic_title)}"',
        f"thematique_id: {topic_num}",
        f'url: "{critere_url}"',
        f"nb_tests: {nb_tests}",
        "---",
        "",
    ]

    # En-tête
    lines += [
        f"# Critère {cid} — {clean_md(topic_title)}",
        "",
        f"**{clean_md(critere.get('title', ''))}**",
        "",
        f"_Source : {critere_url}_",
        "",
    ]

    # Cas particuliers (clé: particularCases)
    cas_particuliers = critere.get("particularCases", [])
    if isinstance(cas_particuliers, str):
        cas_particuliers = [cas_particuliers]
    elif isinstance(cas_particuliers, dict):
        cas_particuliers = list(cas_particuliers.values())
    if cas_particuliers:
        lines += ["**Cas particuliers :**", ""]
        for cp in cas_particuliers:
            lines.append(f"- {clean_md(str(cp))}")
        lines.append("")

    # Notes techniques (clé: technicalNote ou technicalNotes)
    notes = critere.get("technicalNote", critere.get("technicalNotes", []))
    if isinstance(notes, str):
        notes = [notes]
    elif isinstance(notes, dict):
        notes = list(notes.values())
    if notes:
        lines += ["**Notes techniques :**", ""]
        for nt in notes:
            lines.append(f"- {clean_md(str(nt))}")
        lines.append("")

    lines += ["---", ""]

    # Tests
    for test_num_str, test_content in sorted(tests.items(), key=lambda x: int(x[0])):
        tid = f"{cid}.{test_num_str}"
        test_url = f"{BASE_CRITERES_URL}#{tid}"
        lines += [f"## Test {tid}", ""]

        # Contenu du test (chaîne ou liste de conditions)
        lines += [render_item(test_content), ""]

        # Méthodologie
        methodo_key = tid  # ex: "1.1.1"
        methodo = methodologies.get(methodo_key)
        if methodo:
            lines += ["**Méthodologie :**", ""]
            if isinstance(methodo, str):
                # Chaîne multi-lignes : nettoyage des liens Markdown internes
                lines.append(clean_md(methodo))
            elif isinstance(methodo, list):
                for i, step in enumerate(methodo, 1):
                    lines.append(f"{i}. {clean_md(step)}")
            lines.append("")

        lines += [f"_Réf : {test_url}_", "", "---", ""]

    return "\n".join(lines)


# ─── Pipeline principal ───────────────────────────────────────────────────────
def run(criteres_src: str | None, methodo_src: str | None, output_dir: Path) -> int:
    log.info("═" * 60)
    log.info(" RGAA JSON → Markdown RAG v1.0")
    log.info(f"   Sortie : {output_dir.resolve()}")
    log.info("═" * 60)

    # 1. Chargement des données
    log.info("[1/3] Chargement des données JSON…")
    try:
        if criteres_src:
            log.info(f"  Critères  : {criteres_src} (local)")
            data_criteres = load_json(criteres_src)
        else:
            data_criteres = fetch_json(URL_CRITERES)

        if methodo_src:
            log.info(f"  Méthodo   : {methodo_src} (local)")
            data_methodo = load_json(methodo_src)
        else:
            time.sleep(0.5)
            data_methodo = fetch_json(URL_METHODOLOGIE)
    except Exception as e:
        log.error(f"Chargement impossible : {e}")
        return 1

    # Normaliser les méthodologies : {"1.1.1": "1. Étape\n2. Étape\n..."}
    # Format réel dans methodologies.json : clé "X.Y.Z" → chaîne multi-lignes
    methodologies = {}
    if isinstance(data_methodo, dict):
        for k, v in data_methodo.items():
            if isinstance(v, str):
                # Format réel : {"1.1.1": "1. Étape\n2. Étape\n3..."}
                methodologies[k] = v
            elif isinstance(v, list):
                # Format liste (compatibilité)
                methodologies[k] = v

    log.info(f"  {len(methodologies)} méthodologies chargées")

    # 2. Génération
    log.info("[2/3] Génération des fichiers Markdown…")
    output_dir.mkdir(parents=True, exist_ok=True)

    topics = data_criteres.get("topics", data_criteres) if isinstance(data_criteres, dict) else data_criteres
    nb_fichiers = 0
    nb_tests_total = 0
    index = []
    errors = []

    for topic in topics:
        topic_num = topic.get("number", topic.get("id", "?"))
        topic_title = topic.get("topic", topic.get("title", f"Thématique {topic_num}"))
        criteres = topic.get("criteria", topic.get("criteres", []))

        for critere_entry in criteres:
            critere_num = critere_entry.get("criterium", {}).get("number",
                          critere_entry.get("number", "?"))
            critere_data = critere_entry.get("criterium", critere_entry)

            cid = f"{topic_num}.{critere_num}"
            fname = f"critere_{cid}.md"
            fpath = output_dir / fname

            try:
                md = critere_to_markdown(topic_num, topic_title,
                                          critere_num, critere_data,
                                          methodologies)
                fpath.write_text(md, encoding="utf-8")
                nb_tests = len(critere_data.get("tests", {}))
                nb_tests_total += nb_tests
                size = fpath.stat().st_size
                log.info(f"  ✓ {fname:25s} ({size:>6,} o, {nb_tests} tests)")
                index.append({
                    "fichier": fname,
                    "critere_id": cid,
                    "critere_titre": clean_md(critere_data.get("title", "")),
                    "thematique_id": topic_num,
                    "thematique": clean_md(topic_title),
                    "nb_tests": nb_tests,
                    "url": f"{BASE_CRITERES_URL}#{cid}",
                })
                nb_fichiers += 1
            except Exception as e:
                log.error(f"  ✗ {fname}: {e}")
                errors.append(fname)

    # 3. Fichiers d'index
    log.info("[3/3] Écriture de l'index…")
    (output_dir / "index.json").write_text(
        json.dumps({"generator": "rgaa_json_scraper v1.0",
                    "source": "JSON officiel DISIC/accessibilite.numerique.gouv.fr",
                    "criteres": index}, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )

    log.info("═" * 60)
    log.info(f" ✅  {nb_fichiers} fichiers | {nb_tests_total} tests")
    if errors:
        log.warning(f" ⚠  {len(errors)} erreur(s) : {errors}")
    log.info(f"    → {output_dir.resolve()}")
    log.info("═" * 60)
    return 0 if not errors else 2


# ─── CLI ──────────────────────────────────────────────────────────────────────
def main() -> int:
    p = argparse.ArgumentParser(description="RGAA JSON officiel → Markdown pour RAG")
    p.add_argument("--criteres",  "-c", default=None,
                   help="Fichier criteres.json local (sinon téléchargé depuis GitHub)")
    p.add_argument("--methodo",   "-m", default=None,
                   help="Fichier methodologie.json local (sinon téléchargé depuis GitHub)")
    p.add_argument("--output",    "-o", default=DEFAULT_OUT)
    p.add_argument("--debug", action="store_true")
    args = p.parse_args()

    if args.debug:
        logging.getLogger().setLevel(logging.DEBUG)

    return run(args.criteres, args.methodo, Path(args.output))


if __name__ == "__main__":
    sys.exit(main())