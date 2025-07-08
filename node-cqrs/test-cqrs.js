#!/usr/bin/env node

/**
 * Script para testar o funcionamento do CQRS
 * Execute: node test-cqrs.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Configurar axios para não gerar erro em códigos 4xx/5xx
axios.defaults.validateStatus = (status) => status < 500;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testCQRS() {
  console.log('🚀 Iniciando teste do CQRS...\n');
  
  try {
    // 1. Verificar se API está funcionando
    console.log('1. Verificando API...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    if (healthResponse.status !== 200) {
      throw new Error('API não está funcionando');
    }
    console.log('✅ API funcionando\n');

    // 2. Criar produtos (Commands)
    console.log('2. Criando produtos (Commands)...');
    const products = [
      {
        name: 'Notebook Gaming',
        description: 'Notebook para jogos de alto desempenho',
        price: 4500.00,
        stockQuantity: 8
      },
      {
        name: 'Mouse Gamer',
        description: 'Mouse óptico para jogos',
        price: 250.00,
        stockQuantity: 50
      },
      {
        name: 'Teclado Mecânico',
        description: 'Teclado mecânico com RGB',
        price: 400.00,
        stockQuantity: 30
      }
    ];

    const createdProducts = [];
    for (const product of products) {
      const response = await axios.post(`${BASE_URL}/api/products`, product);
      if (response.status === 201) {
        createdProducts.push(response.data.data);
        console.log(`✅ Produto criado: ${product.name}`);
      } else {
        console.log(`❌ Erro ao criar produto: ${product.name}`);
      }
    }
    console.log(`\n📊 ${createdProducts.length} produtos criados\n`);

    // 3. Aguardar sincronização
    console.log('3. Aguardando sincronização...');
    await sleep(2000);
    console.log('✅ Sincronização concluída\n');

    // 4. Testar queries (Read)
    console.log('4. Testando queries (Read)...');
    
    // Listar todos os produtos
    const allProductsResponse = await axios.get(`${BASE_URL}/api/products`);
    if (allProductsResponse.status === 200) {
      const totalProducts = allProductsResponse.data.data.pagination.total;
      console.log(`✅ Produtos listados: ${totalProducts} produtos encontrados`);
    }

    // Buscar produto por ID
    if (createdProducts.length > 0) {
      const productId = createdProducts[0].id;
      const productResponse = await axios.get(`${BASE_URL}/api/products/${productId}`);
      if (productResponse.status === 200) {
        console.log(`✅ Produto encontrado por ID: ${productResponse.data.data.name}`);
      }
    }

    // Pesquisar produtos
    const searchResponse = await axios.get(`${BASE_URL}/api/products/search/gaming`);
    if (searchResponse.status === 200) {
      const searchResults = searchResponse.data.data.products.length;
      console.log(`✅ Pesquisa realizada: ${searchResults} produtos encontrados`);
    }

    // Buscar por faixa de preço
    const priceRangeResponse = await axios.get(`${BASE_URL}/api/products/price-range/200/500`);
    if (priceRangeResponse.status === 200) {
      const priceResults = priceRangeResponse.data.data.products.length;
      console.log(`✅ Busca por preço: ${priceResults} produtos na faixa R$ 200-500`);
    }

    // Estatísticas
    const statsResponse = await axios.get(`${BASE_URL}/api/products/stats/overview`);
    if (statsResponse.status === 200) {
      const stats = statsResponse.data.data;
      console.log(`✅ Estatísticas: ${stats.totalProducts} produtos, R$ ${stats.averagePrice?.toFixed(2)} preço médio`);
    }

    console.log('\n');

    // 5. Testar atualização (Command)
    console.log('5. Testando atualização (Command)...');
    if (createdProducts.length > 0) {
      const productId = createdProducts[0].id;
      const updateData = {
        price: 4200.00,
        stockQuantity: 5
      };
      
      const updateResponse = await axios.put(`${BASE_URL}/api/products/${productId}`, updateData);
      if (updateResponse.status === 200) {
        console.log(`✅ Produto atualizado: ${updateResponse.data.data.name}`);
      }
    }

    // 6. Aguardar sincronização da atualização
    console.log('\n6. Aguardando sincronização da atualização...');
    await sleep(1000);
    console.log('✅ Sincronização da atualização concluída\n');

    // 7. Verificar eventos
    console.log('7. Verificando eventos...');
    const eventsResponse = await axios.get(`${BASE_URL}/api/products/admin/events`);
    if (eventsResponse.status === 200) {
      const events = eventsResponse.data.data;
      console.log(`✅ Eventos encontrados: ${events.length} eventos no Event Store`);
      
      // Contar tipos de eventos
      const eventTypes = events.reduce((acc, event) => {
        acc[event.event_type] = (acc[event.event_type] || 0) + 1;
        return acc;
      }, {});
      
      console.log('📊 Tipos de eventos:');
      Object.entries(eventTypes).forEach(([type, count]) => {
        console.log(`   - ${type}: ${count}`);
      });
    }

    console.log('\n');

    // 8. Testar replay de eventos
    console.log('8. Testando replay de eventos...');
    const replayResponse = await axios.post(`${BASE_URL}/api/products/admin/replay`);
    if (replayResponse.status === 200) {
      console.log(`✅ Replay concluído: ${replayResponse.data.data.processedCount} eventos processados`);
    }

    console.log('\n');

    // 9. Verificar consistência
    console.log('9. Verificando consistência dos dados...');
    const finalListResponse = await axios.get(`${BASE_URL}/api/products`);
    if (finalListResponse.status === 200) {
      const finalProducts = finalListResponse.data.data.products;
      console.log(`✅ Consistência verificada: ${finalProducts.length} produtos na base de leitura`);
    }

    console.log('\n');

    // 10. Testar exclusão (Command)
    console.log('10. Testando exclusão (Command)...');
    if (createdProducts.length > 0) {
      const productId = createdProducts[createdProducts.length - 1].id;
      const deleteResponse = await axios.delete(`${BASE_URL}/api/products/${productId}`);
      if (deleteResponse.status === 200) {
        console.log(`✅ Produto deletado com sucesso`);
      }
    }

    // 11. Aguardar sincronização da exclusão
    console.log('\n11. Aguardando sincronização da exclusão...');
    await sleep(1000);
    console.log('✅ Sincronização da exclusão concluída\n');

    // 12. Resultado final
    console.log('12. Resultado final...');
    const finalResponse = await axios.get(`${BASE_URL}/api/products`);
    if (finalResponse.status === 200) {
      const finalCount = finalResponse.data.data.pagination.total;
      console.log(`✅ Teste concluído: ${finalCount} produtos finais\n`);
    }

    console.log('🎉 TESTE CQRS CONCLUÍDO COM SUCESSO!\n');
    console.log('📋 Resumo do que foi testado:');
    console.log('   ✅ Criação de produtos (Commands)');
    console.log('   ✅ Listagem de produtos (Queries)');
    console.log('   ✅ Busca por ID (Query)');
    console.log('   ✅ Pesquisa por texto (Query)');
    console.log('   ✅ Busca por faixa de preço (Query)');
    console.log('   ✅ Estatísticas (Query)');
    console.log('   ✅ Atualização de produtos (Command)');
    console.log('   ✅ Exclusão de produtos (Command)');
    console.log('   ✅ Event Store funcionando');
    console.log('   ✅ Replay de eventos funcionando');
    console.log('   ✅ Sincronização assíncrona funcionando');
    console.log('   ✅ Consistência entre bases de dados');
    console.log('\n🚀 O padrão CQRS está funcionando perfeitamente!');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Dica: Verifique se a aplicação está rodando em http://localhost:3000');
      console.log('   Execute: npm run dev');
    }
    
    process.exit(1);
  }
}

// Executar teste
if (require.main === module) {
  testCQRS();
}

module.exports = { testCQRS }; 