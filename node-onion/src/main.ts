// Arquivo principal de inicialização
// Ponto de entrada da aplicação

import { createApp } from './app';
import { MongoConnection } from './infrastructure/database/mongoose/connection';
import { config } from './config/environment';

async function bootstrap(): Promise<void> {
  try {
    // Conectar ao banco de dados
    const mongoConnection = MongoConnection.getInstance();
    await mongoConnection.connect(config.database.mongoUri);

    // Criar e inicializar a aplicação
    const app = createApp();
    
    // Inicializar o servidor
    const server = app.listen(config.port, () => {
      console.log(`Servidor rodando na porta ${config.port}`);
      console.log(`Ambiente: ${config.nodeEnv}`);
      console.log(`Endpoints disponíveis:`);
      console.log(`  - Saúde: http://localhost:${config.port}/health`);
      console.log(`  - Info: http://localhost:${config.port}/api/info`);
      console.log(`  - Usuários: http://localhost:${config.port}/api/users`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('Recebido SIGTERM, finalizando servidor...');
      server.close(() => {
        console.log('Servidor finalizado');
        mongoConnection.disconnect();
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('Recebido SIGINT, finalizando servidor...');
      server.close(() => {
        console.log('Servidor finalizado');
        mongoConnection.disconnect();
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Erro ao inicializar a aplicação:', error);
    process.exit(1);
  }
}

bootstrap(); 