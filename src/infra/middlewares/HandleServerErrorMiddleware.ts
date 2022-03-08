import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/CustomError';

export function HandleServerErrorMiddleware(
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
  const { message, name, status } = customError as CustomError;
  response.status((customError as CustomError).status).json({
    status,
    message,
  });
  next();
}
