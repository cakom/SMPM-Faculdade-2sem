const cors = require("cors");// Importa o CORS (permite o frontend acessar o backend)
const mongoose = require("mongoose");// Importa o Mongoose (faz a conexão com o MongoDB)
const router = express. Router();// Cria o router principal (para agrupar as rotas)

// Importa os arquivos de rotas
const userRoutes = require("./routes/userRoutes");// Rotas de usuários
const productRoutes = require("./routes/productRoutes");// Rotas de produtos
const machineRoutes = require("./routes/machineRoutes");// Rotas de máquinas

const app = express (); // Cria a aplicação principal do Express
app.use(cors());  // Ativa o CORS (libera acesso do frontend, ex. :5173)
app.use(express.json()); // Faz o servidor entender JSON no corpo da requisição


// Conecta ao MongoDB no banco crudDB
mongoose.connect("mongodb://localhost:27017/crudDB")
    .then(() => console.log("✓ Conectado ao MongoDB")) // Se conectar, mostra mensagem de sucesso
    .catch(err => console.error("X Erro ao conectar:", err));// Se der erro, mostra a mensagem

// Usa os routers específicos dentro do router principal
router.use("/users", userRoutes);///api/users chama userRoutes
router.use("/products", productRoutes);///api/products chama productRoutes
router.use("/machines", machineRoutes);// /api/machines chama machineRoutes

// Pluga o router no caminho /api
app.use("/api", router);    // Agora todas as rotas ficam sob/api

// Sobe o servidor na porta 5000
app.listen(5000, () =>
console.log(" Servidor rodando em http://localhost:5000") // Mensagem de servidor rodando
);