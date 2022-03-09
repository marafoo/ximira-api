import { Request, Response } from 'express';

export class GithubSigninCallbackController {
  public static async handle(request: Request, response: Response) {
    const { code } = request.query;
    return response.json({
      code,
    });
  }
}
