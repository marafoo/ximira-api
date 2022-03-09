import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/CustomError';

/**
 * @description Middleware para evitar que informaçẽos sensíveis como stack
 * trace seja retornada no resposta do usuário
 * @param error
 * @param request
 * @param response
 * @param next
 */

export function HandleErrorMiddleware(
  error: TypeError | CustomError,
  request: Request,
  response: Response,
  next: NextFunction
) {
  let customError = error;

  if (error instanceof CustomError) {
    customError = new CustomError(
      'There was a problem with your request, please try again later!'
    );
  }
  const { message, status } = customError as CustomError;
  response.status((customError as CustomError).status).json({
    status,
    message,
  });
  next();
}
