// backend/src/routes/maintenanceRoutes.js
const express = require("express");
const router = express.Router();
const Maintenance = require("../models/Maintenance");

// CREATE: cria uma nova manutenção
router.post("/", async (req, res) => {
    try {
        const maintenance = await Maintenance.create(req.body);
        res.status(201).json(maintenance);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

// READ: lista todas as manutenções
router.get("/", async (req, res) => {
    try {
        const maintenances = await Maintenance.find().sort({ criadoEm: -1 });
        res.json(maintenances);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// READ: busca uma manutenção por ID
router.get("/:id", async (req, res) => {
    try {
        const maintenance = await Maintenance.findById(req.params.id);
        if (!maintenance) {
            return res.status(404).json({ erro: "Manutenção não encontrada" });
        }
        res.json(maintenance);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// UPDATE: atualiza uma manutenção por ID
router.put("/:id", async (req, res) => {
    try {
        const maintenance = await Maintenance.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        if (!maintenance) {
            return res.status(404).json({ erro: "Manutenção não encontrada" });
        }
        
        res.json(maintenance);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

// DELETE: remove uma manutenção por ID
router.delete("/:id", async (req, res) => {
    try {
        const maintenance = await Maintenance.findByIdAndDelete(req.params.id);
        if (!maintenance) {
            return res.status(404).json({ erro: "Manutenção não encontrada" });
        }
        res.json({ message: "Manutenção deletada" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

module.exports = router;