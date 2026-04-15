const express = require('express');
const cors = require('cors');

const db = require('./database');

const app = express();

app.use(cors());
app.use(express.json());

// ROTA TESTE
app.get('/', (req, res) => {
  res.send('Servidor rodando');
});

// 👤 CADASTRO
app.post('/register', (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const query = `
      INSERT INTO alunos (nome, email, senha)
      VALUES (?, ?, ?)
    `;

    db.prepare(query).run(nome, email, senha);

    res.json({ message: 'Aluno cadastrado com sucesso' });

  } catch (err) {
    console.log(err);

    res.status(400).json({ error: 'Erro ao cadastrar (email pode já existir)' });
  }
});

// 🔐 LOGIN
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  try {
    const query = `
      SELECT * FROM alunos WHERE email = ? AND senha = ?
    `;

    const user = db.prepare(query).get(email, senha);

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    res.json({
      message: 'Login realizado com sucesso',
      user
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// PORTA (IMPORTANTE PARA RENDER)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Servidor rodando');
});