//backend/src/models/Product.js
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    nome: String,
    preco: Number
});


module.exports = mongoose.model("Product", ProductSchema);