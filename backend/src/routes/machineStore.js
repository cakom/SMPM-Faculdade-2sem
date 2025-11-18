//backend/src/routes/machineRoutes.js
const express = require("express");// Importa o Express
const router = express.Router();// cria un router isolado para as rotas de usuários
const machine = require("../models/Machine"); // Importa o modelo User (Mongoose)

//CREATE: cria um novo Produto
router.post("/", async (req, res) => {// POST /api/users
    const machine = await Machine.create(req.body); // cria documento no Mongolti com os dados de body
    res.json(machine);// Retorna o usuario criado em JSON
});// Fim da rota POST

// READ: lista todos os Produtos
router.get("/", async (req, res) => { // GET /apl/machines 
    const machines = await  Machine.find(); // Busca todos os documentos da coleção
    res.json(machines);// Retorna o array de Produtos
});// Fim da rota GET (lista)

// UPDATE: atualiza un Produto por ID
router.put ("/:id", async (req, res) => { // PUT/api/machines/:id
    const machine = await Machine.findByIdAndUpdate( // Atualiza o documento com o ID informado
    req.params.id, // ID recebido na URL
    req.body, // Dados novos enviados no body
    {new: true} // new: true retorna o documento ja atualizado
    );// Fim do findliyidAndiupdate
    res.json(machine); // Retorna o Produto atualizado
});// Fim da rota PUT

//DELETE: remove in Produto por ID
router.delete("/:id", async (req, res)=> { // DELETE /api/machines/tid
    await Machine.findByIdAndDelete(req.params.id); // Remove o documento com o ID informado
    res.json({ message: "Produto deletado" }); // Retorna mensagem de sucesso
}); // Fim da rota DELETE

module.exports = router; // Exporta o router para ser usado no server