// backend/server.js - Otimizado para Railway
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Importa configuração do Swagger
const { swaggerUi, specs } = require('./swagger');

const app = express();
const PORT = process.env.PORT || 5000;

// ========================================
// CORS - Configuração para Produção
// ========================================
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5000',
    'https://smpm-faculdade-2sem.vercel.app/login',
    process.env.FRONTEND_URL,
    // Railway adiciona automaticamente
].filter(Boolean);

app.use(cors({
    origin: function(origin, callback) {
        // Permite requisições sem origin (mobile apps, Postman, etc)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1 && !origin.includes('railway.app')) {
            const msg = 'A política de CORS não permite acesso desse domínio.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

// Middlewares
app.use(express.json());

// Conexão MongoDB
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URL || 'mongodb://localhost:27017/manutencao';

console.log('🔗 Tentando conectar ao MongoDB...');
console.log('📍 Ambiente:', process.env.NODE_ENV || 'development');

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Conectado ao MongoDB!');
        console.log('📍 Database:', mongoose.connection.name);
        console.log('🔗 Host:', mongoose.connection.host);
        if (process.env.NODE_ENV !== 'production') {
            console.log('🌐 URI:', MONGO_URI);
        }
    })
    .catch(err => {
        console.error('❌ Erro ao conectar MongoDB:', err.message);
        console.error('💡 Verifique se a variável MONGO_URI ou MONGODB_URL está configurada');
    });
    
// Importa as rotas
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const machineRoutes = require("./src/routes/machineRoutes");
const maintenanceRoutes = require("./src/routes/maintenanceRoutes");

// ========================================
// SWAGGER - DOCUMENTAÇÃO DA API
// ========================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "API Manutenção - Documentação"
}));

// Registra as rotas
app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/maquinas", machineRoutes);
app.use("/api/manutencoes", maintenanceRoutes);

// Rota de teste (health check)
app.get("/", (req, res) => {
    res.json({ 
        mensagem: "🔧 API de Manutenção Preventiva",
        status: "online",
        ambiente: process.env.NODE_ENV || "development",
        documentacao: `/api-docs`,
        railway: process.env.RAILWAY_ENVIRONMENT ? "✅ Rodando no Railway" : "❌ Local",
        mongodb: mongoose.connection.readyState === 1 ? "✅ Conectado" : "❌ Desconectado",
        rotas: {
            auth: "/api/login e /api/registro",
            users: "/api/users",
            machines: "/api/maquinas",
            maintenances: "/api/manutencoes"
        }
    });
});

// Health check para Railway
app.get("/health", (req, res) => {
    const health = {
        uptime: process.uptime(),
        status: 'OK',
        timestamp: Date.now(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    };
    res.status(200).json(health);
});

// Tratamento de rotas não encontradas
app.use((req, res) => {
    res.status(404).json({ erro: "Rota não encontrada" });
});

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error('❌ Erro:', err.stack);
    res.status(500).json({ 
        erro: "Erro interno do servidor",
        mensagem: process.env.NODE_ENV === 'production' ? 'Erro no servidor' : err.message
    });
});

// Inicia o servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📚 Documentação Swagger: http://localhost:${PORT}/api-docs`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🚂 Railway: ${process.env.RAILWAY_ENVIRONMENT || 'Não detectado'}`);
});
