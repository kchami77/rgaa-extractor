import React from "react";

/** Highlights search words in text with a yellow background */
export function HighlightText({ text, query }: { text: string; query: string }) {
  if (!text || !query?.trim()) return <>{text}</>;

  // Strip accents helper
  const strip = (s: string) =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const words = strip(query).split(/\s+/).filter(w => w.length >= 1);
  if (words.length === 0) return <>{text}</>;

  const strippedText = strip(text);
  const parts: Array<{ start: number; end: number }> = [];

  for (const word of words) {
    let idx = 0;
    while (idx < strippedText.length) {
      const found = strippedText.indexOf(word, idx);
      if (found === -1) break;
      parts.push({ start: found, end: found + word.length });
      idx = found + 1;
    }
  }

  if (parts.length === 0) return <>{text}</>;

  // Merge overlapping parts
  parts.sort((a, b) => a.start - b.start);
  const merged: typeof parts = [parts[0]];
  for (let i = 1; i < parts.length; i++) {
    const last = merged[merged.length - 1];
    if (parts[i].start <= last.end) {
      last.end = Math.max(last.end, parts[i].end);
    } else {
      merged.push(parts[i]);
    }
  }

  // Build JSX with highlights
  const result: React.ReactNode[] = [];
  let cursor = 0;
  for (const { start, end } of merged) {
    if (cursor < start) {
      result.push(<span key={`t${cursor}`}>{text.slice(cursor, start)}</span>);
    }
    result.push(
      <mark key={`h${start}`} className="bg-yellow-200 text-inherit rounded-sm px-0.5">
        {text.slice(start, end)}
      </mark>
    );
    cursor = end;
  }
  if (cursor < text.length) {
    result.push(<span key={`t${cursor}`}>{text.slice(cursor)}</span>);
  }

  return <>{result}</>;
}
