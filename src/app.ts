import 'dotenv/config';
import 'express-async-errors';

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { router } from './infra/routes';
import { HandleServerErrorMiddleware } from './infra/middlewares/HandleServerErrorMiddleware';

const app = express();

const { PORT } = process.env;

app.use(express.json());

app.use(router);

app.use(helmet());

app.use(cors());

app.use(HandleServerErrorMiddleware);

app.listen(PORT, () =>
  console.log(`Server running on http://0.0.0.0:${PORT}/`)
);
