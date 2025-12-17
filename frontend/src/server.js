const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const { swaggerUi, specs } = require("./swagger");

const app = express();
const PORT = process.env.PORT || 5000;

// =======================
// CORS (PRODUÇÃO OK)
// =======================
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin.includes("vercel.app") ||
        origin.includes("netlify.app") ||
        origin.includes("localhost")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.options("*", cors());

// =======================
// JSON
// =======================
app.use(express.json());

// =======================
// MongoDB
// =======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => console.error("❌ MongoDB erro:", err.message));

// =======================
// ROTAS
// =======================
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/users", require("./src/routes/userRoutes"));
app.use("/api/maquinas", require("./src/routes/machineRoutes"));
app.use("/api/manutencoes", require("./src/routes/maintenanceRoutes"));

// =======================
// Swagger
// =======================
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "API Manutenção",
  })
);

// =======================
// ROOT
// =======================
app.get("/", (req, res) => {
  res.json({
    status: "online",
    api: "Manutenção Preventiva",
    rotas: {
      auth: "/api/auth",
      users: "/api/users",
      maquinas: "/api/maquinas",
      manutencoes: "/api/manutencoes",
    },
  });
});

// =======================
// 404
// =======================
app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada" });
});

// =======================
// START
// =======================
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
