// Camada Presentation - Middlewares
// Middleware global para tratamento de erros

import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Erro:', err);

  // Erros de validação do Mongoose
  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: err.message
    });
    return;
  }

  // Erros de duplicação (email único)
  if (err.name === 'MongoError' && (err as any).code === 11000) {
    res.status(400).json({
      success: false,
      message: 'Email já está em uso'
    });
    return;
  }

  // Erro genérico
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  });
}; 