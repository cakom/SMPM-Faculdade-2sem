// backend/src/routes/machineRoutes.js
const express = require("express");
const router = express.Router();
const Machine = require("../models/Machine");

/**
 * @swagger
 * /api/maquinas:
 *   post:
 *     summary: Criar nova máquina
 *     tags: [Máquinas]
 *     description: Cadastra uma nova máquina no sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - tipo
 *               - local
 *               - proximaManutencao
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Torno CNC 01
 *               tipo:
 *                 type: string
 *                 example: Torno
 *               local:
 *                 type: string
 *                 example: Galpão A - Setor 2
 *               proximaManutencao:
 *                 type: string
 *                 format: date
 *                 example: 2024-12-31
 *               status:
 *                 type: string
 *                 enum: [ativo, parado, manutenção]
 *                 example: ativo
 *     responses:
 *       201:
 *         description: Máquina criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Machine'
 *       400:
 *         description: Dados inválidos
 */
router.post("/", async (req, res) => {
    try {
        const machine = await Machine.create(req.body);
        res.status(201).json(machine);
    } catch (error) {
        res.status(400).json({ erro: error.message });
    }
});

/**
 * @swagger
 * /api/maquinas:
 *   get:
 *     summary: Listar todas as máquinas
 *     tags: [Máquinas]
 *     description: Retorna uma lista de todas as máquinas cadastradas
 *     responses:
 *       200:
 *         description: Lista de máquinas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Machine'
 *       500:
 *         description: Erro no servidor
 */
router.get("/", async (req, res) => {
    try {
        const machines = await Machine.find().sort({ criadoEm: -1 });
        res.json(machines);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

/**
 * @swagger
 * /api/maquinas/{id}:
 *   get:
 *     summary: Buscar máquina por ID
 *     tags: [Máquinas]
 *     description: Retorna os dados de uma máquina específica
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da máquina
 *     responses:
 *       200:
 *         description: Dados da máquina
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Machine'
 *       404:
 *         description: Máquina não encontrada
 *       500:
 *         description: Erro no servidor
 */
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

/**
 * @swagger
 * /api/maquinas/{id}:
 *   put:
 *     summary: Atualizar máquina
 *     tags: [Máquinas]
 *     description: Atualiza os dados de uma máquina existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da máquina
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               tipo:
 *                 type: string
 *               local:
 *                 type: string
 *               proximaManutencao:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [ativo, parado, manutenção]
 *     responses:
 *       200:
 *         description: Máquina atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Machine'
 *       404:
 *         description: Máquina não encontrada
 *       400:
 *         description: Dados inválidos
 */
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

/**
 * @swagger
 * /api/maquinas/{id}:
 *   delete:
 *     summary: Deletar máquina
 *     tags: [Máquinas]
 *     description: Remove uma máquina do sistema
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da máquina
 *     responses:
 *       200:
 *         description: Máquina deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Máquina deletada
 *       404:
 *         description: Máquina não encontrada
 *       500:
 *         description: Erro no servidor
 */
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