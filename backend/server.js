const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

console.log('🚀 Iniciando servidor...');

// Importa configuração do Swagger
const { swaggerUi, specs } = require('./swagger');
console.log('✅ Swagger carregado');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5000',
    'https://smpm-faculdade-2sem.vercel.app',
    'https://smpm-faculdade-2sem-gabs-projects.vercel.app',
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1 && !origin.includes('railway.app') && !origin.includes('vercel.app')) {
            const msg = 'A política de CORS não permite acesso desse domínio.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
console.log('✅ CORS configurado');

app.use(express.json());
console.log('✅ JSON parser configurado');

// MongoDB
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URL || 'mongodb://localhost:27017/manutencao';

console.log('🔗 Tentando conectar ao MongoDB...');
console.log('📍 Ambiente:', process.env.NODE_ENV || 'development');

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB CONECTADO!');
        console.log('📍 Database:', mongoose.connection.name);
        console.log('🔗 Host:', mongoose.connection.host);
    })
    .catch(err => {
        console.error('❌ ERRO ao conectar MongoDB:', err.message);
    });

// IMPORTAR ROTAS
console.log('📦 Carregando rotas...');

const authRoutes = require("./src/routes/authRoutes");
console.log('✅ authRoutes carregado');

const userRoutes = require("./src/routes/userRoutes");
console.log('✅ userRoutes carregado');

const machineRoutes = require("./src/routes/machineRoutes");
console.log('✅ machineRoutes carregado');

const maintenanceRoutes = require("./src/routes/maintenanceRoutes");
console.log('✅ maintenanceRoutes carregado');

// SWAGGER
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "API Manutenção - Documentação"
}));
console.log('✅ Swagger registrado em /api-docs');

// REGISTRAR ROTAS
console.log('🔗 Registrando rotas...');

app.use("/api", authRoutes);
console.log('✅ Rota /api (auth) registrada');

app.use("/api/users", userRoutes);
console.log('✅ Rota /api/users registrada');

app.use("/api/users/registro", authRoutes);
console.log('✅ Rota /api/users registrada');

app.use("/api/maquinas", machineRoutes);
console.log('✅ Rota /api/maquinas registrada');

app.use("/api/manutencoes", maintenanceRoutes);
console.log('✅ Rota /api/manutencoes registrada');

// Rota raiz
app.get("/", (req, res) => {
    res.json({ 
        mensagem: "🔧 API de Manutenção Preventiva",
        status: "online",
        ambiente: process.env.NODE_ENV || "development",
        documentacao: "/api-docs",
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

// Health check
app.get("/health", (req, res) => {
    const health = {
        uptime: process.uptime(),
        status: 'OK',
        timestamp: Date.now(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    };
    res.status(200).json(health);
});

// 404
app.use((req, res) => {
    console.log('⚠️ Rota não encontrada:', req.method, req.path);
    res.status(404).json({ erro: "Rota não encontrada" });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('❌ Erro:', err.stack);
    res.status(500).json({ 
        erro: "Erro interno do servidor",
        mensagem: process.env.NODE_ENV === 'production' ? 'Erro no servidor' : err.message
    });
});

// Inicia servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log('='.repeat(50));
    console.log('🚀 SERVIDOR ONLINE!');
    console.log('='.repeat(50));
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`📚 Docs: http://localhost:${PORT}/api-docs`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🚂 Railway: ${process.env.RAILWAY_ENVIRONMENT || 'Não detectado'}`);
    console.log('='.repeat(50));
});
