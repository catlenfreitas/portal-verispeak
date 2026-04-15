const path = require('path');
const Database = require('better-sqlite3');

const db = new Database(path.join(__dirname, 'database.db'));

// cria tabela se não existir
db.prepare(`
  CREATE TABLE IF NOT EXISTS alunos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT UNIQUE,
    senha TEXT
  )
`).run();

module.exports = db;