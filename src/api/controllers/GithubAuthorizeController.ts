import { Request, Response } from 'express';

const { GITHUB_CLIENT_ID } = process.env;
export class GithubAuthorizeController {
  public static async handle(request: Request, response: Response) {
    response.redirect(
      `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}`
    );
  }
}
