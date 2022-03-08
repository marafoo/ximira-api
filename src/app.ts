import 'dotenv/config';
import 'express-async-errors';

import express from 'express';
import { router } from './infra/routes';
import { HandleServerErrorMiddleware } from './infra/middlewares/HandleServerErrorMiddleware';

const app = express();

const { GITHUB_CLIENT_ID, PORT } = process.env;

app.use(express.json());

app.use(router);

app.get('/github', (request, response) =>
  response.redirect(
    `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}`
  )
);

app.get('/signin/callback', (request, response) => {
  const { code } = request.query;
  return response.json({
    code,
  });
});

app.use(HandleServerErrorMiddleware);

app.listen(PORT, () =>
  console.log(`Server running on http://0.0.0.0:${PORT}/`)
);
