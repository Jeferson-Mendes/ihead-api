import { Request, Response, NextFunction } from 'express';

import { AppError } from './AppError';

export default (
  err: Error,
  request: Request,
  response: Response,
  _: NextFunction,
) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 500,
    message: 'Erro de servidor.',
  });
};
