const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const db = require('./database');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// ROTA TESTE
app.get('/', (req, res) => {
  res.send('Servidor rodando');
});

// 👤 ROTA DE CADASTRO
app.post('/register', (req, res) => {
  const { nome, email, senha } = req.body;

  const query = `
    INSERT INTO alunos (nome, email, senha)
    VALUES (?, ?, ?)
  `;

  db.run(query, [nome, email, senha], function(err) {
    if (err) {
      return res.status(400).json({ error: 'Erro ao cadastrar' });
    }

    res.json({ message: 'Aluno cadastrado com sucesso' });
  });
});

// 🔐 ROTA DE LOGIN (AQUI 👇)
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  const query = `
    SELECT * FROM alunos WHERE email = ? AND senha = ?
  `;

  db.get(query, [email, senha], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Erro no servidor' });
    }

    if (!row) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    res.json({
      message: 'Login realizado com sucesso',
      user: row
    });
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Servidor rodando');
});