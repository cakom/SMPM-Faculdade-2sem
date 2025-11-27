// backend/src/models/Machine.js
const mongoose = require("mongoose");

// Schema de Máquina para sistema de manutenção
const MachineSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true  // Ex: "Torno CNC 01"
    },
    tipo: {
        type: String,
        required: true  // Ex: "Torno", "Fresadora", "Furadeira"
    },
    local: {
        type: String,
        required: true  // Ex: "Galpão A - Setor 2"
    },
    proximaManutencao: {
        type: Date,
        required: true  // Data da próxima manutenção
    },
    status: {
        type: String,
        enum: ['ativo', 'parado', 'manutenção'],
        default: 'ativo'
    },
    criadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  // Referência ao usuário que criou
    },
    criadoEm: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Machine", MachineSchema);