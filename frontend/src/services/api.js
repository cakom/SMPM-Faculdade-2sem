/**
 * api.js - Serviço de comunicação com o Backend
 * 
 * Este arquivo centraliza todas as chamadas para a API.
 * Facilita a manutenção e organização do código.
 */

// URL base da API (onde o backend está rodando)
const API_URL = 'http://localhost:3000/api';

/**
 * Pega o token JWT do localStorage
 * Usado para autenticar requisições
 */
const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Cria headers padrão para requisições
 * Inclui o token de autenticação se existir
 */
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// ===== SERVIÇO DE AUTENTICAÇÃO =====

/**
 * Registra um novo usuário
 * @param {Object} dados - { nome, email, senha, role }
 */
export const registrar = async (dados) => {
  try {
    const response = await fetch(`${API_URL}/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    
    const resultado = await response.json();
    
    if (!response.ok) {
      throw new Error(resultado.erro || 'Erro ao registrar');
    }
    
    return resultado;
  } catch (erro) {
    console.error('Erro no registro:', erro);
    throw erro;
  }
};

/**
 * Faz login do usuário
 * @param {string} email 
 * @param {string} senha 
 */
export const login = async (email, senha) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    
    const resultado = await response.json();
    
    if (!response.ok) {
      throw new Error(resultado.erro || 'Erro ao fazer login');
    }
    
    // Salva token e dados do usuário no localStorage
    localStorage.setItem('token', resultado.token);
    localStorage.setItem('user', JSON.stringify(resultado.usuario));
    
    return resultado;
  } catch (erro) {
    console.error('Erro no login:', erro);
    throw erro;
  }
};

/**
 * Faz logout do usuário
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// ===== SERVIÇO DE MÁQUINAS =====

/**
 * Busca todas as máquinas
 */
export const listarMaquinas = async () => {
  try {
    const response = await fetch(`${API_URL}/maquinas`, {
      headers: getHeaders()
    });
    
    const resultado = await response.json();
    
    if (!response.ok) {
      throw new Error(resultado.erro || 'Erro ao buscar máquinas');
    }
    
    return resultado;
  } catch (erro) {
    console.error('Erro ao listar máquinas:', erro);
    throw erro;
  }
};

/**
 * Cria uma nova máquina
 * @param {Object} dados - { nome, tipo, local, proximaManutencao }
 */
export const criarMaquina = async (dados) => {
  try {
    const response = await fetch(`${API_URL}/maquinas`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dados)
    });
    
    const resultado = await response.json();
    
    if (!response.ok) {
      throw new Error(resultado.erro || 'Erro ao criar máquina');
    }
    
    return resultado;
  } catch (erro) {
    console.error('Erro ao criar máquina:', erro);
    throw erro;
  }
};

/**
 * Remove uma máquina
 * @param {string} id - ID da máquina
 */
export const removerMaquina = async (id) => {
  try {
    const response = await fetch(`${API_URL}/maquinas/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    const resultado = await response.json();
    
    if (!response.ok) {
      throw new Error(resultado.erro || 'Erro ao remover máquina');
    }
    
    return resultado;
  } catch (erro) {
    console.error('Erro ao remover máquina:', erro);
    throw erro;
  }
};

// ===== SERVIÇO DE MANUTENÇÕES =====

/**
 * Busca todas as manutenções
 */
export const listarManutencoes = async () => {
  try {
    const response = await fetch(`${API_URL}/manutencoes`, {
      headers: getHeaders()
    });
    
    const resultado = await response.json();
    
    if (!response.ok) {
      throw new Error(resultado.erro || 'Erro ao buscar manutenções');
    }
    
    return resultado;
  } catch (erro) {
    console.error('Erro ao listar manutenções:', erro);
    throw erro;
  }
};

/**
 * Cria uma nova manutenção
 * @param {Object} dados - { maquina, data, tipo, descricao, tecnico }
 */
export const criarManutencao = async (dados) => {
  try {
    const response = await fetch(`${API_URL}/manutencoes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dados)
    });
    
    const resultado = await response.json();
    
    if (!response.ok) {
      throw new Error(resultado.erro || 'Erro ao criar manutenção');
    }
    
    return resultado;
  } catch (erro) {
    console.error('Erro ao criar manutenção:', erro);
    throw erro;
  }
};

/**
 * Remove uma manutenção
 * @param {string} id - ID da manutenção
 */
export const removerManutencao = async (id) => {
  try {
    const response = await fetch(`${API_URL}/manutencoes/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    
    const resultado = await response.json();
    
    if (!response.ok) {
      throw new Error(resultado.erro || 'Erro ao remover manutenção');
    }
    
    return resultado;
  } catch (erro) {
    console.error('Erro ao remover manutenção:', erro);
    throw erro;
  }
};

// ===== SERVIÇO DE RELATÓRIOS =====

/**
 * Busca dados resumidos para relatórios
 */
export const buscarResumo = async () => {
  try {
    const response = await fetch(`${API_URL}/relatorios/resumo`, {
      headers: getHeaders()
    });
    
    const resultado = await response.json();
    
    if (!response.ok) {
      throw new Error(resultado.erro || 'Erro ao buscar resumo');
    }
    
    return resultado;
  } catch (erro) {
    console.error('Erro ao buscar resumo:', erro);
    throw erro;
  }
};