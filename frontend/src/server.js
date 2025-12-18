const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Swagger
const { swaggerUi, specs } = require("./swagger");

const app = express();
const PORT = process.env.PORT || 5000;

console.log("🚀 Iniciando servidor...");
console.log("🌍 Ambiente:", process.env.NODE_ENV || "development");

// =======================
// CORS (PRODUÇÃO DEFINITIVO)
// =======================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (
    !origin ||
    allowedOrigins.includes(origin) ||
    origin.endsWith(".vercel.app") ||
    origin.endsWith(".netlify.app")
  ) {
    res.header("Access-Control-Allow-Origin", origin || "*");
  }

  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// =======================
// JSON
// =======================
app.use(express.json());
console.log("✅ JSON habilitado");

// =======================
// MongoDB
// =======================
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/manutencao";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB conectado");
    console.log("📦 Database:", mongoose.connection.name);
  })
  .catch((err) =>
    console.error("❌ Erro MongoDB:", err.message)
  );

// =======================
// ROTAS DA API
// =======================
console.log("📦 Registrando rotas...");

app.use("/api/auth", require("./src/routes/authRoutes"));
console.log("✅ /api/auth");

app.use("/api/users", require("./src/routes/userRoutes"));
console.log("✅ /api/users");

app.use("/api/maquinas", require("./src/routes/machineRoutes"));
console.log("✅ /api/maquinas");

app.use("/api/manutencoes", require("./src/routes/maintenanceRoutes"));
console.log("✅ /api/manutencoes");

// =======================
// Swagger
// =======================
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "API Manutenção Preventiva",
  })
);
console.log("📚 Swagger em /api-docs");

// =======================
// ROOT
// =======================
app.get("/", (req, res) => {
  res.json({
    mensagem: "🔧 API de Manutenção Preventiva",
    status: "online",
    ambiente: process.env.NODE_ENV || "development",
    mongodb:
      mongoose.connection.readyState === 1
        ? "✅ Conectado"
        : "❌ Desconectado",
    rotas: {
      auth: "/api/auth/login | /api/auth/registro",
      users: "/api/users",
      maquinas: "/api/maquinas",
      manutencoes: "/api/manutencoes",
    },
    docs: "/api-docs",
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
// START
// =======================
app.listen(PORT, "0.0.0.0", () => {
  console.log("=".repeat(50));
  console.log("🚀 SERVIDOR ONLINE");
  console.log(`📍 Porta: ${PORT}`);
  console.log(`📚 Docs: /api-docs`);
  console.log("=".repeat(50));
});
