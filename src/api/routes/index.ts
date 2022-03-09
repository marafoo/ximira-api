import { Router } from 'express';
import { AuthenticateUserController } from '../controllers/AuthenticateUserController';
import { GithubAuthorizeController } from '../controllers/GithubAuthorizeController';
import { GithubSigninCallbackController } from '../controllers/GithubSigninCallbackController';
import { RequestBodyHandleError } from '../middlewares/RequestBodyHandleError';

const router = Router();

router.get('/github', new GithubAuthorizeController().handle);
router.get('/signin/callback', new GithubSigninCallbackController().handle);
router.post(
  '/authenticate',
  RequestBodyHandleError,
  new AuthenticateUserController().handle
);

export { router };
