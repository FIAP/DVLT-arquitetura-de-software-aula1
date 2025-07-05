import express, { Request, Response } from 'express';
import { UserController } from './controllers/UserController';
import { createUserRoutes } from './routes/userRoutes';

export class Server {
  private app: express.Application;

  constructor(userController: UserController) {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes(userController);
  }

  private setupMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupRoutes(userController: UserController): void {
    this.app.use('/api', createUserRoutes(userController));
    
    // Rota de health check
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
      console.log(`Health check: http://localhost:${port}/health`);
      console.log(`API: http://localhost:${port}/api`);
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
} 