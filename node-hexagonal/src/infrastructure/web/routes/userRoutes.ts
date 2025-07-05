import { Router, Request, Response } from 'express';
import { UserController } from '../controllers/UserController';

export function createUserRoutes(userController: UserController): Router {
  const router = Router();

  router.post('/users', (req: Request, res: Response) => userController.createUser(req, res));
  router.get('/users/:id', (req: Request, res: Response) => userController.getUser(req, res));
  router.get('/users', (req: Request, res: Response) => userController.listUsers(req, res));

  return router;
} 