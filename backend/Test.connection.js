// test-connection.js - Script para testar conexão com MongoDB Atlas
require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

console.log('🔍 Testando conexão com MongoDB...\n');
console.log('📍 URI (sem senha):', MONGO_URI?.replace(/:[^:@]+@/, ':****@'));

async function testarConexao() {
    try {
        console.log('\n⏳ Conectando...');
        
        await mongoose.connect(MONGO_URI);
        
        console.log('\n✅ SUCESSO! Conectado ao MongoDB Atlas!');
        console.log('📍 Database:', mongoose.connection.name);
        console.log('🔗 Host:', mongoose.connection.host);
        console.log('🌐 Estado:', mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado');
        
        // Testa uma operação básica
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\n📦 Coleções existentes:', collections.length > 0 ? collections.map(c => c.name).join(', ') : 'Nenhuma ainda');
        
        // Fecha a conexão
        await mongoose.connection.close();
        console.log('\n✅ Teste concluído com sucesso!');
        
    } catch (error) {
        console.error('\n❌ ERRO ao conectar:', error.message);
        
        // Diagnóstico de erros comuns
        if (error.message.includes('Authentication failed')) {
            console.log('\n💡 Dica: Verifique se o usuário e senha estão corretos no arquivo .env');
            console.log('   - Usuário: deve estar correto');
            console.log('   - Senha: deve ser exatamente como criou no Atlas');
            console.log('   - Caracteres especiais na senha devem ser codificados (@ = %40, # = %23, etc.)');
        }
        
        if (error.message.includes('IP') || error.message.includes('whitelist')) {
            console.log('\n💡 Dica: Seu IP não está liberado no Atlas');
            console.log('   - Vá em: Network Access no Atlas');
            console.log('   - Adicione: 0.0.0.0/0 (permite qualquer IP)');
        }
        
        if (error.message.includes('ENOTFOUND') || error.message.includes('timeout')) {
            console.log('\n💡 Dica: Problema de rede ou cluster não está ativo');
            console.log('   - Verifique sua conexão com a internet');
            console.log('   - Confirme que o cluster está online no Atlas');
        }
        
        process.exit(1);
    }
}

// Executa o teste
testarConexao();