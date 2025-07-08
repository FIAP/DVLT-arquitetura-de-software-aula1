const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { connectMongoDB, testPostgreSQL } = require('./config/database');
const productRoutes = require('./routes/products');
const ProductEventHandler = require('./eventHandlers/ProductEventHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rota principal com informações da API
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API CQRS Demo - Sistema de Produtos',
    description: 'Demonstração do padrão CQRS com Node.js, PostgreSQL e MongoDB',
    architecture: {
      writeDatabase: 'PostgreSQL',
      readDatabase: 'MongoDB',
      pattern: 'CQRS (Command Query Responsibility Segregation)',
      eventSourcing: 'Event Store no PostgreSQL'
    },
    endpoints: {
      products: '/api/products',
      health: '/health',
      docs: '/docs'
    },
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Documentação da API
app.get('/docs', (req, res) => {
  res.json({
    title: 'API CQRS Demo - Documentação',
    baseUrl: `http://localhost:${PORT}`,
    endpoints: {
      commands: {
        description: 'Operações de escrita (Commands) - Modificam o estado',
        routes: {
          'POST /api/products': 'Criar produto',
          'PUT /api/products/:id': 'Atualizar produto',
          'DELETE /api/products/:id': 'Deletar produto'
        }
      },
      queries: {
        description: 'Operações de leitura (Queries) - Consultam o estado',
        routes: {
          'GET /api/products': 'Listar todos os produtos (paginado)',
          'GET /api/products/:id': 'Buscar produto por ID',
          'GET /api/products/search/:term': 'Pesquisar produtos',
          'GET /api/products/price-range/:min/:max': 'Buscar por faixa de preço',
          'GET /api/products/in-stock/list': 'Produtos em estoque',
          'GET /api/products/stats/overview': 'Estatísticas'
        }
      },
      admin: {
        description: 'Rotas administrativas',
        routes: {
          'GET /api/products/admin/events': 'Listar todos os eventos',
          'GET /api/products/admin/events/:aggregateId': 'Eventos de um produto',
          'POST /api/products/admin/sync': 'Sincronizar dados',
          'POST /api/products/admin/replay': 'Replay de eventos'
        }
      }
    },
    exampleProduct: {
      name: 'Produto Exemplo',
      description: 'Descrição do produto',
      price: 100.50,
      stockQuantity: 10
    },
    queryParameters: {
      pagination: 'page, limit',
      sorting: 'sortBy, sortOrder',
      example: '?page=1&limit=5&sortBy=price&sortOrder=asc'
    }
  });
});

// Rotas da API
app.use('/api/products', productRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro na aplicação:', err);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    path: req.path
  });
});

// Função para inicializar a aplicação
async function initializeApp() {
  try {
    console.log('Iniciando aplicação CQRS Demo...');
    
    // Conectar às bases de dados
    console.log('Conectando às bases de dados...');
    await testPostgreSQL();
    await connectMongoDB();
    
    // Sincronizar dados iniciais
    console.log('Sincronizando dados iniciais...');
    try {
      await ProductEventHandler.syncAllProducts();
      console.log('Sincronização inicial concluída');
    } catch (error) {
      console.log('Aviso: Erro na sincronização inicial (normal na primeira execução):', error.message);
    }
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`
========================================
   CQRS Demo - Servidor Iniciado
========================================
Servidor rodando na porta: ${PORT}
Ambiente: ${process.env.NODE_ENV || 'development'}

URLs:
- API: http://localhost:${PORT}
- Documentação: http://localhost:${PORT}/docs
- Health Check: http://localhost:${PORT}/health

Bases de dados:
- PostgreSQL (Write): localhost:5432
- MongoDB (Read): localhost:27017

Padrão CQRS em funcionamento!
========================================
      `);
    });
    
  } catch (error) {
    console.error('Erro ao inicializar aplicação:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Recebido SIGTERM, encerrando aplicação...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Recebido SIGINT, encerrando aplicação...');
  process.exit(0);
});

// Inicializar aplicação
initializeApp();

module.exports = app;