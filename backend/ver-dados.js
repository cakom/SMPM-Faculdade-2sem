import mongoose from 'mongoose';

const MONGO_URL = 'mongodb://mongo:bQwIThZsCzcDQfQWwtyuEsFTIeQvFZeA@ballast.proxy.rlwy.net:40693';

mongoose.connect(MONGO_URL, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 30000,
})
  .then(async () => {
    console.log('✅ Conectado ao MongoDB!');
    
    const db = mongoose.connection.db;
    
    // Listar databases
    const adminDb = db.admin();
    const dbs = await adminDb.listDatabases();
    console.log('\n📚 Databases encontrados:');
    dbs.databases.forEach(db => console.log(`  - ${db.name}`));
    
    // Listar collections do database atual
    const collections = await db.listCollections().toArray();
    console.log('\n📁 Collections:');
    collections.forEach(col => console.log(`  - ${col.name}`));
    
    // Ver dados (descomente para ver usuários)
    // const users = await db.collection('users').find({}).toArray();
    // console.log('\n👥 Usuários:');
    // console.table(users);
    
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Erro ao conectar:', err.message);
    process.exit(1);
  });