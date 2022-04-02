import 'reflect-metadata';
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { errors } from 'celebrate';
import routes from '@core/routes';
import useErrors from '@core/errors';

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use(errors());

app.use(useErrors);

app.listen(process.env.PORT || 3333, () => {
  console.log(`Server on!`);
});
