import 'reflect-metadata';
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { errors } from 'celebrate';
import routes from '@core/routes';
import useErrors from '@core/errors';
import DatabaseConnection from '@core/utils/DatabaseConnection';

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use(errors());

app.use(useErrors);

DatabaseConnection.init()
  .then(() => {
    console.log('Database has ben connected');
    app.listen(process.env.PORT || 3333, () => {
      console.log(`Server on!`);
    });
  })
  .catch(error => {
    console.log(`Fail to connect database... ${error}`);
  });
