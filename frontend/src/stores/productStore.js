import { defineStore } from "pinia";// Importa a função que cria uma store (estado global) no Pinia
import api from "../services/api";// Importa a instância do Axios já configurada com baseURL da API

export const useProductStore = defineStore("product", {
    state: () => ({// state: função que retorna o estado inicial (reativo)
        products: []// products: array que armazenará a lista de produto vinda da API
    }),// fim do state

    actions: {  // actions: métodos assíncronos que podem alterar o estado e chamar a API
        async fetchProducts() {// fetchproducts: busca a lista de produto no backend
            const res = await api.get("/products");
            // Faz requisição GET para /api/products (via baseURL + "/products")
            this.products = res.data;
            // Atualiza o estado com os dados retornados (res.data é o array de produto
        },  // fim de fetchproducts

        async addProduct(product) {
            // addproduct: cria um novo produto no backend
            const res = await api.post("/products", product);
            // Envia o objeto "product" em uma requisição POST para /api/products
            this.products.push(res.data);
            // Insere o produto criado (retornado pela API) no array local (estado)
        },// fim de addproduct

        async deleteProduct(id) {
            // deleteproduct: remove um produto pelo _id
            await api.delete('/products/${id}');
            // Chama DELETE em /api/products/:id para excluir no backend
            this.products = this.products.filter(u => u._id !== id); // Remove do estado local o produto com o id informado
        }// fim de deleteproduct
    }// fim de actions   
});// fim da definição da store