// Configuração de Ambiente
// Centraliza as configurações do ambiente

import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/onion_db',
    mongoUriAdmin: process.env.MONGO_URI_ADMIN || 'mongodb://ocalhost:27017/onion_db?authSource=admin'
  },

  security: {
    jwtSecret: process.env.JWT_SECRET || 'sua_chave_secreta_aqui_muito_segura',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10')
  }
}; 