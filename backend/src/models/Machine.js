
// backend/src/models/Machine.js
const mongoose = require("mongoose");// Importa o Mongoose, que conecta o Node.js ao Mongol

const MachineSchema = new mongoose.Schema({ // cria o "molde" (Schema) dos documentos da coleção
    nome: String, // Campo nome do tipo texto (ex.: "Torno CNC 81")
    status: String // Campo 'status' do tipo texto (ex.: "ativo", "parado")
});// Fecha a definição do Schema

module.exports = mongoose.model("Machine", MachineSchema);  // Cria o "Model" chamado Machine a partir do Schema
                                                            // Esse Model é a "fábrica que permite:
                                                            // criar máquinas novas (Machine.create)
                                                            //listar todas (Machine.find)
                                                            // buscar uma por ID (Machine.FindById)
                                                            // atualizar (Machine, findByIdAndUpdate)
                                                            // excluir (Machine.findByIdAndDelete)