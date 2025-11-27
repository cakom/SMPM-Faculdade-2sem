// backend/src/models/Maintenance.js
const mongoose = require("mongoose");

// Schema de Manutenção
const MaintenanceSchema = new mongoose.Schema({
    maquina: {
        type: String,
        required: true  // Nome da máquina
    },
    data: {
        type: Date,
        required: true  // Data da manutenção realizada
    },
    tipo: {
        type: String,
        enum: ['Preventiva', 'Corretiva', 'Preditiva'],
        required: true
    },
    descricao: {
        type: String  // Descrição do que foi feito
    },
    tecnico: {
        type: String,
        required: true  // Nome do técnico responsável
    },
    registradoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  // Usuário que registrou a manutenção
    },
    criadoEm: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Maintenance", MaintenanceSchema);