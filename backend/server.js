const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const { swaggerUi, specs } = require('./swagger');

const app = express();
const PORT = process.env.PORT || 5000;

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

app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URL || 'mongodb://localhost:27017/manutencao';

console.log('🔗 Tentando conectar ao MongoDB...');
console.log('📍 Ambiente:', process.env.NODE_ENV || 'development');

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Conectado ao MongoDB!');
        console.log('📍 Database:', mongoose.connection.name);
        console.log('🔗 Host:', mongoose.connection.host);
    })
    .catch(err => {
        console.error('❌ Erro ao conectar MongoDB:', err.message);
    });

const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const machineRoutes = require("./src/routes/machineRoutes");
const maintenanceRoutes = require("./src/routes/maintenanceRoutes");

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "API Manutenção - Documentação"
}));

app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/maquinas", machineRoutes);
app.use("/api/manutencoes", maintenanceRoutes);

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

app.get("/health", (req, res) => {
    const health = {
        uptime: process.uptime(),
        status: 'OK',
        timestamp: Date.now(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    };
    res.status(200).json(health);
});

app.use((req, res) => {
    res.status(404).json({ erro: "Rota não encontrada" });
});

app.use((err, req, res, next) => {
    console.error('❌ Erro:', err.stack);
    res.status(500).json({ 
        erro: "Erro interno do servidor",
        mensagem: process.env.NODE_ENV === 'production' ? 'Erro no servidor' : err.message
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📚 Documentação Swagger: http://localhost:${PORT}/api-docs`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🚂 Railway: ${process.env.RAILWAY_ENVIRONMENT || 'Não detectado'}`);
});
