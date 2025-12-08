// swagger.js - Configuração do Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API - Sistema de Manutenção Preventiva',
      version: '1.0.0',
      description: 'Documentação completa da API do sistema de manutenção preventiva de máquinas',
      contact: {
        name: 'Equipe de Desenvolvimento',
        email: 'suporte@manutencao.com'
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor de Desenvolvimento'
      },
      {
        url: 'https://seu-app.onrender.com',
        description: 'Servidor de Produção'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token JWT obtido no login'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['nome', 'email', 'senha'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único do usuário'
            },
            nome: {
              type: 'string',
              description: 'Nome completo do usuário',
              example: 'João Silva'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário',
              example: 'joao@email.com'
            },
            senha: {
              type: 'string',
              format: 'password',
              description: 'Senha do usuário (criptografada)',
              example: 'senha123'
            },
            role: {
              type: 'string',
              enum: ['admin', 'tecnico', 'operador'],
              description: 'Nível de acesso do usuário',
              example: 'operador'
            },
            criadoEm: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do usuário'
            }
          }
        },
        Machine: {
          type: 'object',
          required: ['nome', 'tipo', 'local', 'proximaManutencao'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único da máquina'
            },
            nome: {
              type: 'string',
              description: 'Nome da máquina',
              example: 'Torno CNC 01'
            },
            tipo: {
              type: 'string',
              description: 'Tipo da máquina',
              example: 'Torno'
            },
            local: {
              type: 'string',
              description: 'Localização da máquina',
              example: 'Galpão A - Setor 2'
            },
            proximaManutencao: {
              type: 'string',
              format: 'date',
              description: 'Data da próxima manutenção',
              example: '2024-12-31'
            },
            status: {
              type: 'string',
              enum: ['ativo', 'parado', 'manutenção'],
              description: 'Status atual da máquina',
              example: 'ativo'
            },
            criadoEm: {
              type: 'string',
              format: 'date-time',
              description: 'Data de cadastro da máquina'
            }
          }
        },
        Maintenance: {
          type: 'object',
          required: ['maquina', 'data', 'tipo', 'tecnico'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único da manutenção'
            },
            maquina: {
              type: 'string',
              description: 'Nome da máquina',
              example: 'Torno CNC 01'
            },
            data: {
              type: 'string',
              format: 'date',
              description: 'Data da manutenção',
              example: '2024-12-07'
            },
            tipo: {
              type: 'string',
              enum: ['Preventiva', 'Corretiva', 'Preditiva'],
              description: 'Tipo de manutenção',
              example: 'Preventiva'
            },
            descricao: {
              type: 'string',
              description: 'Descrição detalhada da manutenção',
              example: 'Troca de óleo e lubrificação geral'
            },
            tecnico: {
              type: 'string',
              description: 'Nome do técnico responsável',
              example: 'Carlos Santos'
            },
            criadoEm: {
              type: 'string',
              format: 'date-time',
              description: 'Data de registro da manutenção'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            erro: {
              type: 'string',
              description: 'Mensagem de erro'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js'], // Caminho para os arquivos com anotações
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs
};
