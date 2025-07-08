const ProductRead = require('../models/ProductRead');

class ProductQueries {
  async getAllProducts(options = {}) {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
      
      const skip = (page - 1) * limit;
      const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
      
      const products = await ProductRead.find({})
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();
      
      const total = await ProductRead.countDocuments();
      
      return {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  }

  async getProductById(productId) {
    try {
      const product = await ProductRead.findOne({ productId }).lean();
      
      if (!product) {
        throw new Error('Produto não encontrado');
      }
      
      return product;
    } catch (error) {
      console.error('Erro ao buscar produto por ID:', error);
      throw error;
    }
  }

  async searchProducts(searchTerm, options = {}) {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
      
      const skip = (page - 1) * limit;
      const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
      
      const searchQuery = {
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } }
        ]
      };
      
      const products = await ProductRead.find(searchQuery)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();
      
      const total = await ProductRead.countDocuments(searchQuery);
      
      return {
        products,
        searchTerm,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Erro ao pesquisar produtos:', error);
      throw error;
    }
  }

  async getProductsByPriceRange(minPrice, maxPrice, options = {}) {
    try {
      const { page = 1, limit = 10, sortBy = 'price', sortOrder = 'asc' } = options;
      
      const skip = (page - 1) * limit;
      const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
      
      const priceQuery = {
        price: { $gte: minPrice, $lte: maxPrice }
      };
      
      const products = await ProductRead.find(priceQuery)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();
      
      const total = await ProductRead.countDocuments(priceQuery);
      
      return {
        products,
        priceRange: { min: minPrice, max: maxPrice },
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Erro ao buscar produtos por faixa de preço:', error);
      throw error;
    }
  }

  async getProductsInStock(options = {}) {
    try {
      const { page = 1, limit = 10, sortBy = 'stockQuantity', sortOrder = 'desc' } = options;
      
      const skip = (page - 1) * limit;
      const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
      
      const stockQuery = {
        stockQuantity: { $gt: 0 }
      };
      
      const products = await ProductRead.find(stockQuery)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();
      
      const total = await ProductRead.countDocuments(stockQuery);
      
      return {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Erro ao buscar produtos em estoque:', error);
      throw error;
    }
  }

  async getProductStats() {
    try {
      const stats = await ProductRead.aggregate([
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            totalStock: { $sum: '$stockQuantity' },
            averagePrice: { $avg: '$price' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' },
            productsInStock: {
              $sum: { $cond: [{ $gt: ['$stockQuantity', 0] }, 1, 0] }
            },
            productsOutOfStock: {
              $sum: { $cond: [{ $eq: ['$stockQuantity', 0] }, 1, 0] }
            }
          }
        }
      ]);
      
      return stats[0] || {
        totalProducts: 0,
        totalStock: 0,
        averagePrice: 0,
        minPrice: 0,
        maxPrice: 0,
        productsInStock: 0,
        productsOutOfStock: 0
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas de produtos:', error);
      throw error;
    }
  }
}

module.exports = new ProductQueries(); 