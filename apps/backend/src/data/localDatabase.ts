import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

type LocalDatabase = Record<string, unknown>;

const moduleDir = dirname(fileURLToPath(import.meta.url));
const defaultDatabasePath = resolve(moduleDir, "../../data/campusiq.local.json");
const databasePath = process.env.LOCAL_DB_PATH ? resolve(process.env.LOCAL_DB_PATH) : defaultDatabasePath;

let cache: LocalDatabase | null = null;

function loadDatabase() {
  if (cache) {
    return cache;
  }

  if (!existsSync(databasePath)) {
    cache = {};
    saveDatabase(cache);
    return cache;
  }

  try {
    cache = JSON.parse(readFileSync(databasePath, "utf8")) as LocalDatabase;
  } catch {
    cache = {};
    saveDatabase(cache);
  }

  return cache;
}

function saveDatabase(database: LocalDatabase) {
  mkdirSync(dirname(databasePath), { recursive: true });
  writeFileSync(databasePath, `${JSON.stringify(database, null, 2)}\n`, "utf8");
}

export function readTable<T>(tableName: string, fallback: T): T {
  const database = loadDatabase();

  if (database[tableName] === undefined) {
    database[tableName] = fallback;
    saveDatabase(database);
  }

  return database[tableName] as T;
}

export function writeTable<T>(tableName: string, value: T) {
  const database = loadDatabase();
  database[tableName] = value;
  saveDatabase(database);
  return value;
}

export function databaseInfo() {
  return {
    driver: "local-json",
    status: "connected",
    persistent: true,
    path: databasePath,
    note: "Hackathon-safe local persistent database. Hosted Postgres can replace this by setting DATABASE_URL and wiring Prisma services."
  };
}
