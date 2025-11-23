/**
 * services/api.js - Instância configurada do Axios
 * 
 * Este arquivo cria e exporta uma instância do Axios já configurada
 * com a URL base da API e interceptadores para adicionar token.
 */

import axios from 'axios';

// URL base da API (backend)
// Em desenvolvimento: http://localhost:3000/api
// Em produção: substitua pela URL do seu backend hospedado
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Cria instância do Axios com configurações personalizadas
 */
const api = axios.create({
    baseURL: API_URL,                // URL base para todas as requisições
    timeout: 10000,                  // Timeout de 10 segundos
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * INTERCEPTADOR DE REQUISIÇÃO
 * 
 * Adiciona o token JWT automaticamente em todas as requisições
 * (exceto login e registro que não precisam de token)
 */
api.interceptors.request.use(
    (config) => {
        // Pega o token do localStorage
        const token = localStorage.getItem('token');
        
        // Se existir token, adiciona no header Authorization
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        // Erro antes da requisição ser enviada
        console.error('Erro na requisição:', error);
        return Promise.reject(error);
    }
);

/**
 * INTERCEPTADOR DE RESPOSTA
 * 
 * Trata erros globais, como token expirado
 */
api.interceptors.response.use(
    (response) => {
        // Requisição bem-sucedida, retorna a resposta
        return response;
    },
    (error) => {
        // Trata erros de resposta
        
        if (error.response) {
            // Erro com resposta do servidor
            
            // Se token expirado ou inválido (401)
            if (error.response.status === 401) {
                // Remove token inválido
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                
                // Redireciona para login (se não estiver lá)
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
            
            // Se acesso negado (403)
            if (error.response.status === 403) {
                console.error('Acesso negado: você não tem permissão');
            }
            
            // Erro interno do servidor (500)
            if (error.response.status === 500) {
                console.error('Erro interno do servidor');
            }
        } else if (error.request) {
            // Requisição foi feita mas não houve resposta
            console.error('Servidor não respondeu:', error.request);
        } else {
            // Erro ao configurar a requisição
            console.error('Erro ao configurar requisição:', error.message);
        }
        
        return Promise.reject(error);
    }
);

// Exporta a instância configurada
export default api;