// backend/src/models/User.js
const mongoose = require("mongoose");

// Schema de Usuário com autenticação
const UserSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true  // Campo obrigatório
    },
    email: {
        type: String,
        required: true,
        unique: true    // Email único no sistema
    },
    senha: {
        type: String,
        required: true  // Senha criptografada
    },
    role: {
        type: String,
        enum: ['admin', 'tecnico', 'operador'],  // Só aceita esses valores
        default: 'operador'
    },
    criadoEm: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("User", UserSchema);