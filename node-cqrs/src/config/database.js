const { Pool } = require('pg');
const mongoose = require('mongoose');

// Configurações do PostgreSQL (Write Database)
const pgConfig = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  database: process.env.POSTGRES_DB || 'cqrs_write',
  user: process.env.POSTGRES_USER || 'admin',
  password: process.env.POSTGRES_PASSWORD || 'password',
};

// Configurações do MongoDB (Read Database)
const mongoConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/cqrs_read',
  uriWithAuth: 'mongodb://admin:password@localhost:27017/cqrs_read?authSource=admin',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  }
};

// Pool de conexões PostgreSQL
const pgPool = new Pool(pgConfig);

// Conexão com MongoDB
const connectMongoDB = async () => {
  try {
    // Tentar conexão sem autenticação primeiro (configuração de desenvolvimento)
    console.log('Tentando conectar ao MongoDB...');
    await mongoose.connect(mongoConfig.uri, mongoConfig.options);
    console.log('Conectado ao MongoDB (Read Database)');
  } catch (error) {
    console.log('Falha na conexão padrão, tentando com autenticação...');
    
    try {
      // Tentar com autenticação se a primeira falhar
      await mongoose.connect(mongoConfig.uriWithAuth, mongoConfig.options);
      console.log('Conectado ao MongoDB (Read Database) com autenticação');
    } catch (secondError) {
      console.error('Erro ao conectar ao MongoDB (ambas tentativas falharam):');
      console.error('Erro sem auth:', error.message);
      console.error('Erro com auth:', secondError.message);
      console.error('Verifique se o MongoDB está rodando e acessível');
      console.error('');
      console.error('💡 Dicas para resolver:');
      console.error('1. Verifique se os containers estão rodando: docker ps');
      console.error('2. Reinicie os containers: docker-compose down && docker-compose up -d');
      console.error('3. Use o setup rápido: npm run quick-setup');
      process.exit(1);
    }
  }
};

// Teste de conexão PostgreSQL
const testPostgreSQL = async () => {
  try {
    const client = await pgPool.connect();
    console.log('Conectado ao PostgreSQL (Write Database)');
    client.release();
  } catch (error) {
    console.error('Erro ao conectar ao PostgreSQL:', error);
    process.exit(1);
  }
};

module.exports = {
  pgPool,
  connectMongoDB,
  testPostgreSQL
}; 