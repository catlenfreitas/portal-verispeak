const Database = require('better-sqlite3');

// cria ou conecta ao banco
const db = new Database('database.db');

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