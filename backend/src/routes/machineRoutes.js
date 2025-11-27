// backend/src/routes/machineRoutes.js
const express = require("express");
const router = express.Router();
const Machine = require("../models/Machine");

// CREATE: cria uma nova máquina
router.post("/", async (req, res) => {
    try {
        const machine = await Machine.create(req.body);
        res.status(201).json(machine);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

// READ: lista todas as máquinas
router.get("/", async (req, res) => {
    try {
        const machines = await Machine.find().sort({ criadoEm: -1 });
        res.json(machines);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// READ: busca uma máquina por ID
router.get("/:id", async (req, res) => {
    try {
        const machine = await Machine.findById(req.params.id);
        if (!machine) {
            return res.status(404).json({ erro: "Máquina não encontrada" });
        }
        res.json(machine);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// UPDATE: atualiza uma máquina por ID
router.put("/:id", async (req, res) => {
    try {
        const machine = await Machine.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        if (!machine) {
            return res.status(404).json({ erro: "Máquina não encontrada" });
        }
        
        res.json(machine);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

// DELETE: remove uma máquina por ID
router.delete("/:id", async (req, res) => {
    try {
        const machine = await Machine.findByIdAndDelete(req.params.id);
        if (!machine) {
            return res.status(404).json({ erro: "Máquina não encontrada" });
        }
        res.json({ message: "Máquina deletada" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

module.exports = router;