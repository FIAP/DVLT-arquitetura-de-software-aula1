// Aplicação Express
// Configuração principal da aplicação

import express from 'express';
import cors from 'cors';
import { createUserRoutes } from './presentation/routes/userRoutes';
import { errorHandler } from './presentation/middlewares/errorHandler';
import { DependencyContainer } from './config/dependencies';

export function createApp(): express.Application {
  const app = express();

  // Middlewares globais
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Injeção de dependências
  const dependencies = DependencyContainer.getInstance();
  const userController = dependencies.getUserController();

  // Rotas
  app.use('/api/users', createUserRoutes(userController));

  // Rota de saúde
  app.get('/health', (req, res) => {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      message: 'Aplicação funcionando corretamente'
    });
  });

  // Rota de informações da arquitetura
  app.get('/api/info', (req, res) => {
    res.json({
      name: 'Demonstração Onion Architecture',
      version: '1.0.0',
      description: 'Projeto demonstrando arquitetura Onion com Node.js, TypeScript e MongoDB',
      architecture: {
        layers: [
          'Domain (Entidades, Value Objects, Interfaces)',
          'Application (Casos de uso, Serviços)',
          'Infrastructure (Implementações, Banco de dados)',
          'Presentation (Controllers, Rotas, Middlewares)'
        ]
      },
      endpoints: {
        'GET /health': 'Verificar saúde da aplicação',
        'GET /api/info': 'Informações da aplicação',
        'POST /api/users': 'Criar usuário',
        'GET /api/users': 'Listar usuários',
        'GET /api/users/:id': 'Buscar usuário por ID',
        'PUT /api/users/:id': 'Atualizar usuário',
        'DELETE /api/users/:id': 'Deletar usuário'
      }
    });
  });

  // Middleware de tratamento de erros (deve ser o último)
  app.use(errorHandler);

  return app;
} 