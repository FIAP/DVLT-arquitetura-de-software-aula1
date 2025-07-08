#!/usr/bin/env node

/**
 * Script de configuração inicial do projeto CQRS
 * Execute: node setup.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Configuração inicial do projeto CQRS\n');

// Verificar se o Node.js está na versão correta
const nodeVersion = process.version;
console.log(`Node.js versão: ${nodeVersion}`);

const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion < 16) {
  console.error('❌ Node.js versão 16 ou superior é necessário');
  process.exit(1);
}
console.log('✅ Versão do Node.js compatível\n');

// Verificar se Docker está instalado
try {
  execSync('docker --version', { stdio: 'ignore' });
  console.log('✅ Docker encontrado');
} catch (error) {
  console.error('❌ Docker não encontrado. Instale o Docker para continuar.');
  process.exit(1);
}

try {
  execSync('docker-compose --version', { stdio: 'ignore' });
  console.log('✅ Docker Compose encontrado\n');
} catch (error) {
  console.error('❌ Docker Compose não encontrado. Instale o Docker Compose para continuar.');
  process.exit(1);
}

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
console.log('📦 Verificando dependências...');
const packageJsonPath = path.join(__dirname, 'package.json');
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

// Verificar se as portas estão disponíveis
console.log('🔍 Verificando portas disponíveis...');
const { spawn } = require('child_process');

function checkPort(port) {
  return new Promise((resolve) => {
    const { exec } = require('child_process');
    exec(`lsof -i :${port}`, (error, stdout) => {
      if (error) {
        // Porta está livre
        resolve(true);
      } else {
        // Porta está em uso
        resolve(false);
      }
    });
  });
}

async function checkPorts() {
  const ports = [3000, 5432, 27017];
  const results = [];
  
  for (const port of ports) {
    const isAvailable = await checkPort(port);
    const service = port === 3000 ? 'API' : port === 5432 ? 'PostgreSQL' : 'MongoDB';
    
    if (isAvailable) {
      console.log(`✅ Porta ${port} (${service}) disponível`);
    } else {
      console.log(`⚠️  Porta ${port} (${service}) em uso`);
    }
    
    results.push({ port, service, available: isAvailable });
  }
  
  return results;
}

// Iniciar containers Docker
async function startDockerContainers() {
  console.log('\n🐳 Iniciando containers Docker...');
  
  try {
    // Verificar se Docker está rodando
    execSync('docker info', { stdio: 'ignore' });
  } catch (error) {
    console.error('❌ Docker não está rodando. Inicie o Docker e tente novamente.');
    return false;
  }
  
  try {
    // Parar containers existentes
    console.log('🔄 Parando containers existentes...');
    execSync('docker-compose down', { stdio: 'ignore' });
    
    // Iniciar containers
    console.log('🚀 Iniciando containers...');
    execSync('docker-compose up -d', { stdio: 'inherit' });
    
    console.log('✅ Containers iniciados com sucesso\n');
    return true;
  } catch (error) {
    console.error('❌ Erro ao iniciar containers:', error.message);
    return false;
  }
}

// Aguardar containers estarem prontos
async function waitForContainers() {
  console.log('⏳ Aguardando containers estarem prontos...');
  
  // Aguardar PostgreSQL
  let postgresReady = false;
  let attempts = 0;
  const maxAttempts = 30;
  
  while (!postgresReady && attempts < maxAttempts) {
    try {
      execSync('docker exec cqrs-postgres pg_isready -U admin', { stdio: 'ignore' });
      postgresReady = true;
      console.log('✅ PostgreSQL pronto');
    } catch (error) {
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  if (!postgresReady) {
    console.error('❌ PostgreSQL não ficou pronto a tempo');
    return false;
  }
  
  // Aguardar MongoDB
  let mongoReady = false;
  attempts = 0;
  
  while (!mongoReady && attempts < maxAttempts) {
    try {
      // Tentar diferentes comandos dependendo da versão do MongoDB
      try {
        execSync('docker exec cqrs-mongodb mongosh --eval "db.runCommand(\'ping\')"', { stdio: 'ignore' });
        mongoReady = true;
      } catch (error) {
        // Fallback para versões mais antigas
        execSync('docker exec cqrs-mongodb mongo --eval "db.runCommand(\'ping\')"', { stdio: 'ignore' });
        mongoReady = true;
      }
      console.log('✅ MongoDB pronto');
    } catch (error) {
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  if (!mongoReady) {
    console.error('❌ MongoDB não ficou pronto a tempo');
    return false;
  }
  
  return true;
}

// Função principal
async function main() {
  try {
    // Verificar portas
    const portResults = await checkPorts();
    
    // Iniciar containers
    const dockerStarted = await startDockerContainers();
    if (!dockerStarted) {
      console.error('❌ Falha ao iniciar containers Docker');
      process.exit(1);
    }
    
    // Aguardar containers
    const containersReady = await waitForContainers();
    if (!containersReady) {
      console.error('❌ Containers não ficaram prontos');
      process.exit(1);
    }
    
    console.log('\n🎉 Configuração concluída com sucesso!\n');
    
    console.log('📋 Próximos passos:');
    console.log('1. Executar a aplicação:');
    console.log('   npm run dev');
    console.log('');
    console.log('2. Testar o CQRS:');
    console.log('   node test-cqrs.js');
    console.log('');
    console.log('3. Acessar a API:');
    console.log('   http://localhost:3000');
    console.log('');
    console.log('4. Ver documentação:');
    console.log('   http://localhost:3000/docs');
    console.log('');
    console.log('🚀 Projeto CQRS pronto para uso!');
    
  } catch (error) {
    console.error('❌ Erro durante a configuração:', error.message);
    process.exit(1);
  }
}

// Executar configuração
if (require.main === module) {
  main();
} 