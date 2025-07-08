const { pgPool } = require('../config/database');
const EventStore = require('../eventStore/EventStore');
const EventHandler = require('../eventHandlers/ProductEventHandler');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');

class ProductCommands {
  // Esquemas de validação
  static createProductSchema = Joi.object({
    name: Joi.string().required().min(3).max(255),
    description: Joi.string().max(500),
    price: Joi.number().required().min(0),
    stockQuantity: Joi.number().integer().min(0).default(0)
  });

  static updateProductSchema = Joi.object({
    name: Joi.string().min(3).max(255),
    description: Joi.string().max(500),
    price: Joi.number().min(0),
    stockQuantity: Joi.number().integer().min(0)
  });

  async createProduct(productData) {
    // Validar dados
    const { error, value } = ProductCommands.createProductSchema.validate(productData);
    if (error) {
      throw new Error(`Dados inválidos: ${error.details[0].message}`);
    }

    const client = await pgPool.connect();
    try {
      await client.query('BEGIN');
      
      const productId = uuidv4();
      const now = new Date();
      
      // Inserir produto na base de escrita (PostgreSQL)
      const insertQuery = `
        INSERT INTO products (id, name, description, price, stock_quantity, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      
      const insertValues = [
        productId,
        value.name,
        value.description || '',
        value.price,
        value.stockQuantity,
        now,
        now
      ];
      
      const result = await client.query(insertQuery, insertValues);
      const product = result.rows[0];
      
      // Salvar evento
      const eventData = {
        productId,
        name: value.name,
        description: value.description || '',
        price: value.price,
        stockQuantity: value.stockQuantity,
        createdAt: now
      };
      
      await EventStore.saveEvent(productId, 'ProductCreated', eventData);
      
      await client.query('COMMIT');
      
      // Processar evento assincronamente
      setImmediate(async () => {
        await EventHandler.handleProductCreated(eventData);
      });
      
      console.log(`Produto criado: ${product.name} (ID: ${productId})`);
      return product;
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro ao criar produto:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async updateProduct(productId, updateData) {
    // Validar dados
    const { error, value } = ProductCommands.updateProductSchema.validate(updateData);
    if (error) {
      throw new Error(`Dados inválidos: ${error.details[0].message}`);
    }

    const client = await pgPool.connect();
    try {
      await client.query('BEGIN');
      
      // Verificar se produto existe
      const existsQuery = 'SELECT * FROM products WHERE id = $1';
      const existsResult = await client.query(existsQuery, [productId]);
      
      if (existsResult.rows.length === 0) {
        throw new Error('Produto não encontrado');
      }
      
      const currentProduct = existsResult.rows[0];
      
      // Construir query de atualização dinamicamente
      const updateFields = [];
      const updateValues = [];
      let valueIndex = 1;
      
      Object.keys(value).forEach(key => {
        if (value[key] !== undefined) {
          updateFields.push(`${key.replace(/([A-Z])/g, '_$1').toLowerCase()} = $${valueIndex}`);
          updateValues.push(value[key]);
          valueIndex++;
        }
      });
      
      if (updateFields.length === 0) {
        throw new Error('Nenhum campo para atualizar');
      }
      
      updateFields.push(`updated_at = $${valueIndex}`);
      updateValues.push(new Date());
      updateValues.push(productId);
      
      const updateQuery = `
        UPDATE products 
        SET ${updateFields.join(', ')}
        WHERE id = $${valueIndex + 1}
        RETURNING *
      `;
      
      const result = await client.query(updateQuery, updateValues);
      const updatedProduct = result.rows[0];
      
      // Salvar evento
      const eventData = {
        productId,
        changes: value,
        previousData: {
          name: currentProduct.name,
          description: currentProduct.description,
          price: parseFloat(currentProduct.price),
          stockQuantity: currentProduct.stock_quantity
        },
        updatedAt: new Date()
      };
      
      const version = await EventStore.getLatestVersion(productId) + 1;
      await EventStore.saveEvent(productId, 'ProductUpdated', eventData, version);
      
      await client.query('COMMIT');
      
      // Processar evento assincronamente
      setImmediate(async () => {
        await EventHandler.handleProductUpdated(eventData);
      });
      
      console.log(`Produto atualizado: ${updatedProduct.name} (ID: ${productId})`);
      return updatedProduct;
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro ao atualizar produto:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async deleteProduct(productId) {
    const client = await pgPool.connect();
    try {
      await client.query('BEGIN');
      
      // Verificar se produto existe
      const existsQuery = 'SELECT * FROM products WHERE id = $1';
      const existsResult = await client.query(existsQuery, [productId]);
      
      if (existsResult.rows.length === 0) {
        throw new Error('Produto não encontrado');
      }
      
      const product = existsResult.rows[0];
      
      // Deletar produto
      const deleteQuery = 'DELETE FROM products WHERE id = $1';
      await client.query(deleteQuery, [productId]);
      
      // Salvar evento
      const eventData = {
        productId,
        name: product.name,
        deletedAt: new Date()
      };
      
      const version = await EventStore.getLatestVersion(productId) + 1;
      await EventStore.saveEvent(productId, 'ProductDeleted', eventData, version);
      
      await client.query('COMMIT');
      
      // Processar evento assincronamente
      setImmediate(async () => {
        await EventHandler.handleProductDeleted(eventData);
      });
      
      console.log(`Produto deletado: ${product.name} (ID: ${productId})`);
      return { message: 'Produto deletado com sucesso' };
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro ao deletar produto:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new ProductCommands(); 