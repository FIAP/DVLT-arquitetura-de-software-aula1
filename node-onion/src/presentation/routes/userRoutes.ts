// Camada Presentation - Rotas
// Define as rotas HTTP e validações

import { Router } from 'express';
import { body, param } from 'express-validator';
import { UserController } from '../controllers/UserController';
import { validateRequest } from '../middlewares/validateRequest';

export function createUserRoutes(userController: UserController): Router {
  const router = Router();

  // POST /users - Criar usuário
  router.post(
    '/',
    [
      body('name')
        .isLength({ min: 2, max: 100 })
        .withMessage('Nome deve ter entre 2 e 100 caracteres')
        .trim(),
      body('email')
        .isEmail()
        .withMessage('Email deve ser válido')
        .normalizeEmail(),
      body('password')
        .isLength({ min: 6 })
        .withMessage('Senha deve ter pelo menos 6 caracteres')
    ],
    validateRequest,
    userController.createUser
  );

  // GET /users - Listar todos os usuários
  router.get('/', userController.getAllUsers);

  // GET /users/:id - Buscar usuário por ID
  router.get(
    '/:id',
    [
      param('id')
        .notEmpty()
        .withMessage('ID é obrigatório')
    ],
    validateRequest,
    userController.getUserById
  );

  // PUT /users/:id - Atualizar usuário
  router.put(
    '/:id',
    [
      param('id')
        .notEmpty()
        .withMessage('ID é obrigatório'),
      body('name')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Nome deve ter entre 2 e 100 caracteres')
        .trim(),
      body('email')
        .optional()
        .isEmail()
        .withMessage('Email deve ser válido')
        .normalizeEmail(),
      body('password')
        .optional()
        .isLength({ min: 6 })
        .withMessage('Senha deve ter pelo menos 6 caracteres')
    ],
    validateRequest,
    userController.updateUser
  );

  // DELETE /users/:id - Deletar usuário
  router.delete(
    '/:id',
    [
      param('id')
        .notEmpty()
        .withMessage('ID é obrigatório')
    ],
    validateRequest,
    userController.deleteUser
  );

  return router;
} 