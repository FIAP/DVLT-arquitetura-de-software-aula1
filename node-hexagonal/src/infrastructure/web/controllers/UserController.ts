import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../../application/use-cases/CreateUserUseCase';
import { GetUserUseCase } from '../../../application/use-cases/GetUserUseCase';
import { ListUsersUseCase } from '../../../application/use-cases/ListUsersUseCase';

export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private getUserUseCase: GetUserUseCase,
    private listUsersUseCase: ListUsersUseCase
  ) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, email } = req.body;

      if (!name || !email) {
        res.status(400).json({ 
          error: 'Nome e email são obrigatórios' 
        });
        return;
      }

      const user = await this.createUserUseCase.execute({ name, email });
      
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      });
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const user = await this.getUserUseCase.execute(id);
      
      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Erro interno do servidor' 
      });
    }
  }

  async listUsers(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.listUsersUseCase.execute();
      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Erro interno do servidor' 
      });
    }
  }
} 