import { Request, Response, NextFunction } from 'express';

/**
 * @description Middleware para evitar que informaçẽos sensíveis como stack
 * @param request
 * @param response
 * @param next
 */

export function RequestBodyHandleError(
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (Object.keys(request.body).length === 0) {
    response.status(400).json({
      message: 'Body empty',
    });
  }
  next();
}
