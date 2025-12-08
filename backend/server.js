// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Importa configuração do Swagger
const { swaggerUi, specs } = require('./swagger');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/manutencao';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Conectado ao MongoDB!');
        console.log('📍 Database:', mongoose.connection.name);
        console.log('🔗 Host:', mongoose.connection.host);
        console.log('🌐 URI:', MONGO_URI);
    })
    .catch(err => console.error('❌ Erro ao conectar MongoDB:', err));
    
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

// Rota de teste
app.get("/", (req, res) => {
    res.json({ 
        mensagem: "🔧 API de Manutenção Preventiva",
        documentacao: `http://localhost:${PORT}/api-docs`,
        rotas: {
            auth: "/api/login e /api/registro",
            users: "/api/users",
            machines: "/api/maquinas",
            maintenances: "/api/manutencoes"
        }
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📚 Documentação Swagger: http://localhost:${PORT}/api-docs`);
});