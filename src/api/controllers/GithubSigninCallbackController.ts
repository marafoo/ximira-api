import { Request, Response } from 'express';

export class GithubSigninCallbackController {
  async handle(request: Request, response: Response) {
    const { code } = request.query;
    return response.json({
      code,
    });
  }
}
