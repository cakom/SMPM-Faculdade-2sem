/** server.js - Servidor Backend (Node.js + Express + MongoDB)
 Este arquivo é o "cérebro" do backend.
 Ele recebe requisições do frontend e fala com o banco de dados.
 */

// ===== IMPORTAÇÕES =====
// Express - framework para criar servidor web
const express = require('express');
// Mongoose - biblioteca para trabalhar com MongoDB de forma fácil
const mongoose = require('mongoose');
// Cors - permite que o frontend (Vue) se comunique com o backend
const cors = require('cors');
// Bcrypt - para criptografar senhas
const bcrypt = require('bcrypt');
// JWT - para criar tokens de autenticação
const jwt = require('jsonwebtoken');
// Dotenv - para usar variáveis de ambiente (.env)
require('dotenv').config();

// ===== CONFIGURAÇÃO DO SERVIDOR =====
const app = express(); // Cria o servidor
const PORT = 3000;     // Porta onde o servidor vai rodar

// Middlewares (interceptadores de requisições)
app.use(cors());                    // Permite requisições do Vue
app.use(express.json());            // Permite receber JSON no body

// Chave secreta para JWT (em produção, colocar no .env)
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-aqui';

// ===== CONEXÃO COM MONGODB =====
// String de conexão do MongoDB (substitua pela sua)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/manutencao';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Conectado ao MongoDB!'))
  .catch(err => console.error('❌ Erro ao conectar MongoDB:', err));

// ===== MODELOS (SCHEMAS) DO BANCO DE DADOS =====

/**
 * Schema de Usuário
 * Define como um usuário é salvo no banco
 */
const usuarioSchema = new mongoose.Schema({
  nome: { 
    type: String, 
    required: true  // Campo obrigatório
  },
  email: { 
    type: String, 
    required: true, 
    unique: true    // Email único no sistema
  },
  senha: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['admin', 'tecnico', 'operador'],  // Só aceita esses valores
    default: 'operador' 
  },
  criadoEm: { 
    type: Date, 
    default: Date.now 
  }
});

// Cria o modelo Usuario baseado no schema
const Usuario = mongoose.model('Usuario', usuarioSchema);

/**
 * Schema de Máquina
 */
const maquinaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  tipo: { type: String, required: true },
  local: { type: String, required: true },
  proximaManutencao: { type: Date, required: true },
  criadoPor: { 
    type: mongoose.Schema.Types.ObjectId,  // Referência ao usuário
    ref: 'Usuario' 
  },
  criadoEm: { type: Date, default: Date.now }
});

const Maquina = mongoose.model('Maquina', maquinaSchema);

/**
 * Schema de Manutenção
 */
const manutencaoSchema = new mongoose.Schema({
  maquina: { type: String, required: true },
  data: { type: Date, required: true },
  tipo: { 
    type: String, 
    enum: ['Preventiva', 'Corretiva', 'Preditiva'],
    required: true 
  },
  descricao: { type: String },
  tecnico: { type: String, required: true },
  registradoPor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario' 
  },
  criadoEm: { type: Date, default: Date.now }
});

const Manutencao = mongoose.model('Manutencao', manutencaoSchema);

// ===== MIDDLEWARE DE AUTENTICAÇÃO =====
/**
 * Verifica se o usuário está autenticado (tem token válido)
 * Este middleware é usado em rotas protegidas
 */
const autenticar = (req, res, next) => {
  // Pega o token do cabeçalho da requisição
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  try {
    // Verifica se o token é válido
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded; // Adiciona dados do usuário na requisição
    next(); // Continua para a próxima função
  } catch (erro) {
    return res.status(401).json({ erro: 'Token inválido' });
  }
};

// ===== ROTAS DE AUTENTICAÇÃO =====

/**
 * POST /api/registro - Registrar novo usuário
 */
app.post('/api/registro', async (req, res) => {
  try {
    const { nome, email, senha, role } = req.body;

    // Verifica se email já existe
    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ erro: 'Email já cadastrado' });
    }

    // Criptografa a senha (bcrypt)
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    // Cria novo usuário
    const novoUsuario = new Usuario({
      nome,
      email,
      senha: senhaCriptografada,
      role: role || 'operador'
    });

    await novoUsuario.save(); // Salva no banco

    res.status(201).json({ 
      mensagem: 'Usuário criado com sucesso!',
      usuario: { id: novoUsuario._id, nome, email, role: novoUsuario.role }
    });

  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao registrar usuário' });
  }
});

/**
 * POST /api/login - Login de usuário
 */
app.post('/api/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Busca usuário pelo email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ erro: 'Email ou senha incorretos' });
    }

    // Compara senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Email ou senha incorretos' });
    }

    // Cria token JWT (válido por 7 dias)
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, role: usuario.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      mensagem: 'Login realizado com sucesso!',
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role
      }
    });

  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao fazer login' });
  }
});

// ===== ROTAS DE MÁQUINAS (PROTEGIDAS) =====

/**
 * GET /api/maquinas - Listar todas as máquinas
 */
app.get('/api/maquinas', autenticar, async (req, res) => {
  try {
    const maquinas = await Maquina.find().sort({ criadoEm: -1 });
    res.json(maquinas);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar máquinas' });
  }
});

/**
 * POST /api/maquinas - Criar nova máquina
 */
app.post('/api/maquinas', autenticar, async (req, res) => {
  try {
    const { nome, tipo, local, proximaManutencao } = req.body;

    const novaMaquina = new Maquina({
      nome,
      tipo,
      local,
      proximaManutencao,
      criadoPor: req.usuario.id
    });

    await novaMaquina.save();
    res.status(201).json(novaMaquina);

  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao criar máquina' });
  }
});

/**
 * DELETE /api/maquinas/:id - Remover máquina
 */
app.delete('/api/maquinas/:id', autenticar, async (req, res) => {
  try {
    await Maquina.findByIdAndDelete(req.params.id);
    res.json({ mensagem: 'Máquina removida com sucesso' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao remover máquina' });
  }
});

// ===== ROTAS DE MANUTENÇÕES (PROTEGIDAS) =====

/**
 * GET /api/manutencoes - Listar todas as manutenções
 */
app.get('/api/manutencoes', autenticar, async (req, res) => {
  try {
    const manutencoes = await Manutencao.find().sort({ criadoEm: -1 });
    res.json(manutencoes);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar manutenções' });
  }
});

/**
 * POST /api/manutencoes - Criar nova manutenção
 */
app.post('/api/manutencoes', autenticar, async (req, res) => {
  try {
    const { maquina, data, tipo, descricao, tecnico } = req.body;

    const novaManutencao = new Manutencao({
      maquina,
      data,
      tipo,
      descricao,
      tecnico,
      registradoPor: req.usuario.id
    });

    await novaManutencao.save();
    res.status(201).json(novaManutencao);

  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao criar manutenção' });
  }
});

/**
 * DELETE /api/manutencoes/:id - Remover manutenção
 */
app.delete('/api/manutencoes/:id', autenticar, async (req, res) => {
  try {
    await Manutencao.findByIdAndDelete(req.params.id);
    res.json({ mensagem: 'Manutenção removida com sucesso' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao remover manutenção' });
  }
});

// ===== ROTA DE RELATÓRIOS =====

/**
 * GET /api/relatorios/resumo - Gera resumo para relatórios
 */
app.get('/api/relatorios/resumo', autenticar, async (req, res) => {
  try {
    const totalMaquinas = await Maquina.countDocuments();
    const totalManutencoes = await Manutencao.countDocuments();
    
    // Manutenções por tipo
    const manutencoesPorTipo = await Manutencao.aggregate([
      { $group: { _id: '$tipo', total: { $sum: 1 } } }
    ]);

    res.json({
      totalMaquinas,
      totalManutencoes,
      manutencoesPorTipo
    });

  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao gerar relatório' });
  }
});

// ===== INICIA O SERVIDOR =====
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
