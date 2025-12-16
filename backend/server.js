const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

console.log("🚀 Iniciando servidor...");

// Swagger
const { swaggerUi, specs } = require("./swagger");
console.log("✅ Swagger carregado");

const app = express();
const PORT = process.env.PORT || 5000;

// =======================
// CORS
// =======================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5000",
  "https://smpm-faculdade-2sem.vercel.app",
  "https://smpm-faculdade-2sem-gabs-projects.vercel.app",
  "https://spmp-faculdade-2sem.netlify.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.includes("railway.app") ||
        origin.includes("vercel.app") ||
        origin.includes("netlify.app")
      ) {
        return callback(null, true);
      }

      return callback(
        new Error("A política de CORS não permite acesso desse domínio."),
        false
      );
    },
    credentials: true,
  })
);
console.log("✅ CORS configurado");

// =======================
// JSON
// =======================
app.use(express.json());
console.log("✅ JSON parser configurado");

// =======================
// MongoDB
// =======================
const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URL ||
  "mongodb://localhost:27017/manutencao";

console.log("🔗 Tentando conectar ao MongoDB...");
console.log("📍 Ambiente:", process.env.NODE_ENV || "development");

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB CONECTADO!");
    console.log("📍 Database:", mongoose.connection.name);
  })
  .catch((err) => {
    console.error("❌ ERRO ao conectar MongoDB:", err.message);
  });

// =======================
// ROTAS
// =======================
console.log("📦 Carregando rotas...");

const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const machineRoutes = require("./src/routes/machineRoutes");
const maintenanceRoutes = require("./src/routes/maintenanceRoutes");

console.log("✅ Rotas carregadas");

// =======================
// Swagger
// =======================
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "API Manutenção - Documentação",
  })
);
console.log("✅ Swagger registrado em /api-docs");

// =======================
// REGISTRO DAS ROTAS
// =======================
app.use("/api/auth", authRoutes);
console.log("✅ /api/auth registrado");

app.use("/api/users", userRoutes);
console.log("✅ /api/users registrado");

app.use("/api/maquinas", machineRoutes);
console.log("✅ /api/maquinas registrado");

app.use("/api/manutencoes", maintenanceRoutes);
console.log("✅ /api/manutencoes registrado");

// =======================
// ROTAS AUXILIARES
// =======================
app.get("/", (req, res) => {
  res.json({
    mensagem: "🔧 API de Manutenção Preventiva",
    status: "online",
    ambiente: process.env.NODE_ENV || "development",
    documentacao: "/api-docs",
    mongodb:
      mongoose.connection.readyState === 1
        ? "✅ Conectado"
        : "❌ Desconectado",
    rotas: {
      auth: "/api/auth/login | /api/auth/register",
      users: "/api/users",
      maquinas: "/api/maquinas",
      manutencoes: "/api/manutencoes",
    },
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    uptime: process.uptime(),
    status: "OK",
    timestamp: Date.now(),
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// =======================
// 404
// =======================
app.use((req, res) => {
  console.warn("⚠️ Rota não encontrada:", req.method, req.path);
  res.status(404).json({ erro: "Rota não encontrada" });
});

// =======================
// ERROR HANDLER
// =======================
app.use((err, req, res, next) => {
  console.error("❌ Erro:", err.message);
  res.status(500).json({
    erro: "Erro interno do servidor",
    mensagem:
      process.env.NODE_ENV === "production"
        ? "Erro no servidor"
        : err.message,
  });
});

// =======================
// START
// =======================
app.listen(PORT, "0.0.0.0", () => {
  console.log("=".repeat(50));
  console.log("🚀 SERVIDOR ONLINE!");
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📚 Docs: http://localhost:${PORT}/api-docs`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || "development"}`);
  console.log("=".repeat(50));
});
