import express, { Express } from 'express';
import { UserController } from '../../interface-adapters/controllers/UserController';

export class ExpressServer {
  private app: Express;

  constructor(private userController: UserController) {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupRoutes(): void {
    // Rotas dos usuários
    this.app.post('/users', (req, res) => this.userController.createUser(req, res));
    this.app.get('/users/:id', (req, res) => this.userController.getUser(req, res));
    this.app.get('/users', (req, res) => this.userController.getAllUsers(req, res));

    // Rota de health check
    this.app.get('/health', (req, res) => {
      res.json({ status: 'OK', message: 'Servidor rodando com Clean Architecture' });
    });
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
      console.log(`Health check: http://localhost:${port}/health`);
      console.log(`Rotas disponíveis:`);
      console.log(`  POST /users - Criar usuário`);
      console.log(`  GET /users - Listar todos os usuários`);
      console.log(`  GET /users/:id - Buscar usuário por ID`);
    });
  }

  public getApp(): Express {
    return this.app;
  }
} 