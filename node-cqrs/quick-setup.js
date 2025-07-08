#!/usr/bin/env node

/**
 * Script de configuração rápida e simples do projeto CQRS
 * Execute: node quick-setup.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Configuração rápida do projeto CQRS\n');

// Criar arquivo .env se não existir
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Criando arquivo .env...');
  const envContent = `# Configurações do servidor
PORT=3000
NODE_ENV=development

# Configurações do PostgreSQL (Write Database)
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=cqrs_write
POSTGRES_USER=admin
POSTGRES_PASSWORD=password

# Configurações do MongoDB (Read Database - Sem autenticação para desenvolvimento)
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_DB=cqrs_read
MONGODB_USER=admin
MONGODB_PASSWORD=password
MONGODB_URI=mongodb://localhost:27017/cqrs_read

# Configurações de Event Store
EVENT_STORE_TABLE=events
`;
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Arquivo .env criado\n');
} else {
  console.log('✅ Arquivo .env já existe\n');
}

// Verificar se as dependências estão instaladas
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Instalando dependências...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependências instaladas\n');
  } catch (error) {
    console.error('❌ Erro ao instalar dependências:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Dependências já instaladas\n');
}

// Iniciar containers Docker
console.log('🐳 Iniciando containers Docker...');
try {
  // Verificar se Docker está rodando
  execSync('docker info', { stdio: 'ignore' });
  console.log('✅ Docker está rodando');
} catch (error) {
  console.error('❌ Docker não está rodando. Inicie o Docker e tente novamente.');
  process.exit(1);
}

try {
  // Parar containers existentes se houver
  console.log('🔄 Parando containers existentes...');
  execSync('docker-compose -f docker-compose-simple.yml down', { stdio: 'ignore' });
  execSync('docker-compose down', { stdio: 'ignore' });
  
  // Iniciar containers (versão simples sem autenticação)
  console.log('🚀 Iniciando containers (versão simplificada)...');
  execSync('docker-compose -f docker-compose-simple.yml up -d', { stdio: 'inherit' });
  
  console.log('✅ Containers iniciados (MongoDB sem autenticação para desenvolvimento)\n');
} catch (error) {
  console.error('❌ Erro ao gerenciar containers:', error.message);
  console.log('💡 Tentando com docker-compose padrão...');
  
  try {
    execSync('docker-compose up -d', { stdio: 'inherit' });
    console.log('✅ Containers iniciados com docker-compose padrão\n');
  } catch (fallbackError) {
    console.error('❌ Ambas tentativas falharam:', fallbackError.message);
    process.exit(1);
  }
}

// Aguardar um tempo para os containers iniciarem
console.log('⏳ Aguardando containers iniciarem (30 segundos)...');
console.log('   Isso garante que PostgreSQL e MongoDB estejam prontos\n');

setTimeout(() => {
  console.log('🎉 Configuração concluída!\n');
  
  console.log('📋 Próximos passos:');
  console.log('1. Executar a aplicação:');
  console.log('   npm run dev');
  console.log('');
  console.log('2. Testar o CQRS:');
  console.log('   npm test');
  console.log('');
  console.log('3. Acessar a API:');
  console.log('   http://localhost:3000');
  console.log('');
  console.log('4. Ver documentação:');
  console.log('   http://localhost:3000/docs');
  console.log('');
  console.log('📊 Status dos containers:');
  try {
    execSync('docker ps --filter "name=cqrs-" --format "table {{.Names}}\\t{{.Status}}"', { stdio: 'inherit' });
  } catch (error) {
    console.log('   Execute "docker ps" para verificar o status');
  }
  console.log('');
  console.log('🚀 Projeto CQRS pronto para uso!');
}, 30000);

console.log('💡 Se quiser verificar o progresso dos containers:');
console.log('   docker-compose logs -f');
console.log(''); 