const ProductRead = require('../models/ProductRead');

class ProductEventHandler {
  async handleProductCreated(eventData) {
    try {
      console.log('Processando evento ProductCreated:', eventData.productId);
      
      // Criar produto na base de leitura (MongoDB)
      const productRead = new ProductRead({
        productId: eventData.productId,
        name: eventData.name,
        description: eventData.description,
        price: eventData.price,
        stockQuantity: eventData.stockQuantity,
        createdAt: eventData.createdAt,
        updatedAt: eventData.createdAt
      });
      
      await productRead.save();
      
      console.log(`Produto sincronizado na base de leitura: ${eventData.name} (ID: ${eventData.productId})`);
      return productRead;
    } catch (error) {
      console.error('Erro ao processar evento ProductCreated:', error);
      
      // Em um sistema real, você poderia implementar retry logic ou dead letter queue
      if (error.code === 11000) {
        console.log('Produto já existe na base de leitura, ignorando evento duplicado');
        return null;
      }
      
      throw error;
    }
  }

  async handleProductUpdated(eventData) {
    try {
      console.log('Processando evento ProductUpdated:', eventData.productId);
      
      // Atualizar produto na base de leitura
      const updateData = {
        ...eventData.changes,
        updatedAt: eventData.updatedAt
      };
      
      const updatedProduct = await ProductRead.findOneAndUpdate(
        { productId: eventData.productId },
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!updatedProduct) {
        console.warn(`Produto não encontrado na base de leitura para atualização: ${eventData.productId}`);
        
        // Tentar recriar o produto a partir dos dados do evento
        const productRead = new ProductRead({
          productId: eventData.productId,
          name: eventData.changes.name || eventData.previousData.name,
          description: eventData.changes.description || eventData.previousData.description,
          price: eventData.changes.price || eventData.previousData.price,
          stockQuantity: eventData.changes.stockQuantity || eventData.previousData.stockQuantity,
          updatedAt: eventData.updatedAt
        });
        
        await productRead.save();
        console.log(`Produto recriado na base de leitura: ${eventData.productId}`);
        return productRead;
      }
      
      console.log(`Produto atualizado na base de leitura: ${updatedProduct.name} (ID: ${eventData.productId})`);
      return updatedProduct;
    } catch (error) {
      console.error('Erro ao processar evento ProductUpdated:', error);
      throw error;
    }
  }

  async handleProductDeleted(eventData) {
    try {
      console.log('Processando evento ProductDeleted:', eventData.productId);
      
      // Deletar produto da base de leitura
      const deletedProduct = await ProductRead.findOneAndDelete(
        { productId: eventData.productId }
      );
      
      if (!deletedProduct) {
        console.warn(`Produto não encontrado na base de leitura para exclusão: ${eventData.productId}`);
        return null;
      }
      
      console.log(`Produto deletado da base de leitura: ${eventData.name} (ID: ${eventData.productId})`);
      return deletedProduct;
    } catch (error) {
      console.error('Erro ao processar evento ProductDeleted:', error);
      throw error;
    }
  }

  async syncAllProducts() {
    try {
      console.log('Iniciando sincronização completa de produtos...');
      
      const { pgPool } = require('../config/database');
      const client = await pgPool.connect();
      
      try {
        // Buscar todos os produtos do PostgreSQL
        const result = await client.query('SELECT * FROM products ORDER BY created_at');
        const products = result.rows;
        
        console.log(`Encontrados ${products.length} produtos no PostgreSQL`);
        
        // Limpar base de leitura
        await ProductRead.deleteMany({});
        console.log('Base de leitura limpa');
        
        // Sincronizar cada produto
        for (const product of products) {
          const productRead = new ProductRead({
            productId: product.id,
            name: product.name,
            description: product.description,
            price: parseFloat(product.price),
            stockQuantity: product.stock_quantity,
            createdAt: product.created_at,
            updatedAt: product.updated_at
          });
          
          await productRead.save();
        }
        
        console.log(`Sincronização completa: ${products.length} produtos sincronizados`);
        return { syncedCount: products.length };
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Erro durante sincronização completa:', error);
      throw error;
    }
  }

  async replayEvents() {
    try {
      console.log('Iniciando replay de eventos...');
      
      const EventStore = require('../eventStore/EventStore');
      const events = await EventStore.getAllEvents();
      
      console.log(`Encontrados ${events.length} eventos para replay`);
      
      // Limpar base de leitura
      await ProductRead.deleteMany({});
      console.log('Base de leitura limpa');
      
      // Processar eventos em ordem cronológica
      for (const event of events) {
        try {
          switch (event.event_type) {
            case 'ProductCreated':
              await this.handleProductCreated(event.event_data);
              break;
            case 'ProductUpdated':
              await this.handleProductUpdated(event.event_data);
              break;
            case 'ProductDeleted':
              await this.handleProductDeleted(event.event_data);
              break;
            default:
              console.warn(`Tipo de evento desconhecido: ${event.event_type}`);
          }
        } catch (error) {
          console.error(`Erro ao processar evento ${event.id}:`, error);
          // Continuar com o próximo evento
        }
      }
      
      console.log(`Replay concluído: ${events.length} eventos processados`);
      return { processedCount: events.length };
    } catch (error) {
      console.error('Erro durante replay de eventos:', error);
      throw error;
    }
  }
}

module.exports = new ProductEventHandler(); 