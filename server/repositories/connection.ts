import { drizzle } from "drizzle-orm/mysql2";

let _db: ReturnType<typeof drizzle> | null = null;

/**
 * Lazily create the drizzle instance so local tooling can run without a DB.
 */
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      let url = process.env.DATABASE_URL!;
      // Forcer le charset UTF-8 pour éviter les problèmes d'encodage (è→Ã¨)
      if (!url.includes("charset=")) {
        url += (url.includes("?") ? "&" : "?") + "charset=utf8mb4";
      }
      _db = drizzle(url);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
