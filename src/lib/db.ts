import path from "path";
import Database from "better-sqlite3";

interface Wish {
  id: number;
  name: string;
  message: string;
  date: string;
}

const dbPath = path.join(process.cwd(), "data", "messages.db");

function getDb() {
  const db = new Database(dbPath);
  db.prepare(
    `CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      date TEXT NOT NULL
    )`
  ).run();
  return db;
}

export function getMessages(): Wish[] {
  const db = getDb();
  try {
    const rows = db.prepare("SELECT id, name, message, date FROM messages ORDER BY id DESC").all();
    return rows as Wish[];
  } finally {
    db.close();
  }
}

export function addMessage(name: string, message: string, date: string): Wish {
  const db = getDb();
  try {
    const info = db.prepare("INSERT INTO messages (name, message, date) VALUES (?, ?, ?)").run(name, message, date);
    const row = db.prepare("SELECT id, name, message, date FROM messages WHERE id = ?").get(info.lastInsertRowid as number);
    return row as Wish;
  } finally {
    db.close();
  }
}

export default { getMessages, addMessage };
