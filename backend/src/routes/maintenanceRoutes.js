// backend/src/routes/maintenanceRoutes.js
const express = require("express");
const router = express.Router();
const Maintenance = require("../models/Maintenance");

/**
 * @swagger
 * /api/manutencoes:
 *   post:
 *     summary: Registrar nova manutenção
 *     tags: [Manutenções]
 *     description: Registra uma nova manutenção realizada em uma máquina
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - maquina
 *               - data
 *               - tipo
 *               - tecnico
 *             properties:
 *               maquina:
 *                 type: string
 *                 example: Torno CNC 01
 *               data:
 *                 type: string
 *                 format: date
 *                 example: 2024-12-07
 *               tipo:
 *                 type: string
 *                 enum: [Preventiva, Corretiva, Preditiva]
 *                 example: Preventiva
 *               descricao:
 *                 type: string
 *                 example: Troca de óleo e lubrificação geral
 *               tecnico:
 *                 type: string
 *                 example: Carlos Santos
 *     responses:
 *       201:
 *         description: Manutenção registrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Maintenance'
 *       400:
 *         description: Dados inválidos
 */
router.post("/", async (req, res) => {
    try {
        const maintenance = await Maintenance.create(req.body);
        res.status(201).json(maintenance);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

/**
 * @swagger
 * /api/manutencoes:
 *   get:
 *     summary: Listar todas as manutenções
 *     tags: [Manutenções]
 *     description: Retorna uma lista de todas as manutenções registradas
 *     responses:
 *       200:
 *         description: Lista de manutenções
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Maintenance'
 *       500:
 *         description: Erro no servidor
 */
router.get("/", async (req, res) => {
    try {
        const maintenances = await Maintenance.find().sort({ criadoEm: -1 });
        res.json(maintenances);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

/**
 * @swagger
 * /api/manutencoes/{id}:
 *   get:
 *     summary: Buscar manutenção por ID
 *     tags: [Manutenções]
 *     description: Retorna os dados de uma manutenção específica
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da manutenção
 *     responses:
 *       200:
 *         description: Dados da manutenção
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Maintenance'
 *       404:
 *         description: Manutenção não encontrada
 *       500:
 *         description: Erro no servidor
 */
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

/**
 * @swagger
 * /api/manutencoes/{id}:
 *   put:
 *     summary: Atualizar manutenção
 *     tags: [Manutenções]
 *     description: Atualiza os dados de uma manutenção existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da manutenção
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               maquina:
 *                 type: string
 *               data:
 *                 type: string
 *                 format: date
 *               tipo:
 *                 type: string
 *                 enum: [Preventiva, Corretiva, Preditiva]
 *               descricao:
 *                 type: string
 *               tecnico:
 *                 type: string
 *     responses:
 *       200:
 *         description: Manutenção atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Maintenance'
 *       404:
 *         description: Manutenção não encontrada
 *       400:
 *         description: Dados inválidos
 */
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

/**
 * @swagger
 * /api/manutencoes/{id}:
 *   delete:
 *     summary: Deletar manutenção
 *     tags: [Manutenções]
 *     description: Remove uma manutenção do sistema
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da manutenção
 *     responses:
 *       200:
 *         description: Manutenção deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Manutenção deletada
 *       404:
 *         description: Manutenção não encontrada
 *       500:
 *         description: Erro no servidor
 */
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