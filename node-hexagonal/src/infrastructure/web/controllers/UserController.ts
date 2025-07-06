import { Request, Response } from 'express';
import { CreateUserPort, GetUserPort, ListUsersPort } from '../../../application/ports/UserUseCasesPorts';

export class UserController {
  constructor(
    private readonly createUserPort: CreateUserPort,
    private readonly getUserPort: GetUserPort,
    private readonly listUsersPort: ListUsersPort
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

      const user = await this.createUserPort.execute({ name, email });
      
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
      
      const user = await this.getUserPort.execute(id);
      
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
      const result = await this.listUsersPort.execute();
      res.json(result);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Erro interno do servidor' 
      });
    }
  }
} 