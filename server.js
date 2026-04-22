
const express = require('express');
const cors = require('cors');
const supabase = require('./supabase');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor Verispeak rodando 🚀');
});

/* =========================
   LOGIN COM LÓGICA DE OFENSIVA
========================= */
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const { data: user, error } = await supabase
      .from('alunos')
      .select('*')
      .eq('email', email)
      .eq('senha', senha)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // --- LÓGICA DE OFENSIVA (STREAK) ---
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas os dias

    let novaOfensiva = user.ofensiva || 0;
    
    if (user.last_login) {
      const ultimoLogin = new Date(user.last_login);
      ultimoLogin.setHours(0, 0, 0, 0);

      const diferencaDias = (hoje - ultimoLogin) / (1000 * 60 * 60 * 24);

      if (diferencaDias === 1) {
        // Logou no dia seguinte: +1 dia de ofensiva
        novaOfensiva += 1;
      } else if (diferencaDias > 1) {
        // Pulou um dia ou mais: Reseta para 1
        novaOfensiva = 1;
      }
      // Se diferencaDias for 0, ele já logou hoje, mantém o que está.
    } else {
      // Primeiro login da vida: Começa com 1
      novaOfensiva = 1;
    }

    // Atualiza o banco com a nova ofensiva e a data de hoje
    const { data: updatedUser } = await supabase
      .from('alunos')
      .update({ 
        ofensiva: novaOfensiva, 
        last_login: hoje.toISOString() 
      })
      .eq('id', user.id)
      .select()
      .single();

    res.json({
      message: 'Login realizado com sucesso',
      user: updatedUser // Retorna o usuário já atualizado
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

/* =========================
   REGISTER (CADASTRO)
========================= */
app.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    // Adicionamos valores padrão para ofensiva e progresso no cadastro
    const { data, error } = await supabase
      .from('alunos')
      .insert([{ 
        nome, 
        email, 
        senha, 
        ofensiva: 0, 
        progresso: 0,
        last_login: null 
      }]);

    if (error) throw error;

    res.json({ message: 'Aluno cadastrado com sucesso' });

  } catch (err) {
    console.log(err);
    res.status(400).json({ error: 'Erro ao cadastrar' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});