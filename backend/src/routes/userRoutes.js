// backend/src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// CREATE: cria um novo usuário
router.post("/", async (req, res) => {
    try {
        // Criptografa a senha antes de salvar
        const senhaCriptografada = await bcrypt.hash(req.body.senha, 10);
        
        const user = await User.create({
            ...req.body,
            senha: senhaCriptografada
        });
        
        // Remove senha da resposta
        const userResponse = user.toObject();
        delete userResponse.senha;
        
        res.json(userResponse);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

// READ: lista todos os usuários
router.get("/", async (req, res) => {
    try {
        const users = await User.find().select('-senha');  // Não retorna senhas
        res.json(users);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// READ: busca um usuário por ID
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-senha');
        if (!user) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// UPDATE: atualiza um usuário por ID
router.put("/:id", async (req, res) => {
    try {
        // Se estiver atualizando senha, criptografa
        if (req.body.senha) {
            req.body.senha = await bcrypt.hash(req.body.senha, 10);
        }
        
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).select('-senha');
        
        if (!user) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }
        
        res.json(user);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

// DELETE: remove um usuário por ID
router.delete("/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }
        res.json({ message: "Usuário deletado" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

module.exports = router;