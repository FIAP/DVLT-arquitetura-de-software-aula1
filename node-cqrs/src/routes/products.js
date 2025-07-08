const express = require('express');
const router = express.Router();
const ProductCommands = require('../commands/ProductCommands');
const ProductQueries = require('../queries/ProductQueries');
const EventStore = require('../eventStore/EventStore');
const ProductEventHandler = require('../eventHandlers/ProductEventHandler');

// ROTAS DE COMANDO (WRITE) - Operações que modificam o estado

// Criar produto
router.post('/', async (req, res) => {
  try {
    const product = await ProductCommands.createProduct(req.body);
    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso',
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Atualizar produto
router.put('/:id', async (req, res) => {
  try {
    const product = await ProductCommands.updateProduct(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Produto atualizado com sucesso',
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Deletar produto
router.delete('/:id', async (req, res) => {
  try {
    const result = await ProductCommands.deleteProduct(req.params.id);
    res.json({
      success: true,
      message: 'Produto deletado com sucesso',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// ROTAS DE QUERY (READ) - Operações que consultam o estado

// Listar todos os produtos
router.get('/', async (req, res) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      sortBy: req.query.sortBy || 'createdAt',
      sortOrder: req.query.sortOrder || 'desc'
    };
    
    const result = await ProductQueries.getAllProducts(options);
    res.json({
      success: true,
      message: 'Produtos encontrados',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Buscar produto por ID
router.get('/:id', async (req, res) => {
  try {
    const product = await ProductQueries.getProductById(req.params.id);
    res.json({
      success: true,
      message: 'Produto encontrado',
      data: product
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

// Pesquisar produtos
router.get('/search/:term', async (req, res) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      sortBy: req.query.sortBy || 'createdAt',
      sortOrder: req.query.sortOrder || 'desc'
    };
    
    const result = await ProductQueries.searchProducts(req.params.term, options);
    res.json({
      success: true,
      message: 'Pesquisa realizada',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Buscar produtos por faixa de preço
router.get('/price-range/:min/:max', async (req, res) => {
  try {
    const minPrice = parseFloat(req.params.min);
    const maxPrice = parseFloat(req.params.max);
    
    if (isNaN(minPrice) || isNaN(maxPrice)) {
      return res.status(400).json({
        success: false,
        message: 'Preços devem ser números válidos'
      });
    }
    
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      sortBy: req.query.sortBy || 'price',
      sortOrder: req.query.sortOrder || 'asc'
    };
    
    const result = await ProductQueries.getProductsByPriceRange(minPrice, maxPrice, options);
    res.json({
      success: true,
      message: 'Produtos encontrados na faixa de preço',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Buscar produtos em estoque
router.get('/in-stock/list', async (req, res) => {
  try {
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      sortBy: req.query.sortBy || 'stockQuantity',
      sortOrder: req.query.sortOrder || 'desc'
    };
    
    const result = await ProductQueries.getProductsInStock(options);
    res.json({
      success: true,
      message: 'Produtos em estoque encontrados',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Estatísticas de produtos
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await ProductQueries.getProductStats();
    res.json({
      success: true,
      message: 'Estatísticas de produtos',
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ROTAS DE ADMINISTRAÇÃO E DEBUG

// Listar todos os eventos
router.get('/admin/events', async (req, res) => {
  try {
    const events = await EventStore.getAllEvents();
    res.json({
      success: true,
      message: 'Eventos encontrados',
      data: events,
      count: events.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Buscar eventos por aggregate ID
router.get('/admin/events/:aggregateId', async (req, res) => {
  try {
    const events = await EventStore.getEventsByAggregateId(req.params.aggregateId);
    res.json({
      success: true,
      message: 'Eventos do produto encontrados',
      data: events,
      count: events.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Sincronizar dados manualmente
router.post('/admin/sync', async (req, res) => {
  try {
    const result = await ProductEventHandler.syncAllProducts();
    res.json({
      success: true,
      message: 'Sincronização concluída',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Replay de eventos
router.post('/admin/replay', async (req, res) => {
  try {
    const result = await ProductEventHandler.replayEvents();
    res.json({
      success: true,
      message: 'Replay de eventos concluído',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router; 