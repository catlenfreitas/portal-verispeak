const express = require('express');
const cors = require('cors');
const supabase = require('./supabase');

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   ROTA TESTE
========================= */
app.get('/', (req, res) => {
  res.send('Servidor rodando');
});

/* =========================
   REGISTER (CADASTRO)
========================= */
app.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const { data, error } = await supabase
      .from('alunos')
      .insert([{ nome, email, senha }]);

    if (error) throw error;

    res.json({ message: 'Aluno cadastrado com sucesso' });

  } catch (err) {
    console.log(err);
    res.status(400).json({ error: 'Erro ao cadastrar' });
  }
});

/* =========================
   LOGIN
========================= */
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const { data, error } = await supabase
      .from('alunos')
      .select('*')
      .eq('email', email)
      .eq('senha', senha)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    res.json({
      message: 'Login realizado com sucesso',
      user: data
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

/* =========================
   PORTA
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});