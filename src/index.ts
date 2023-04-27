import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import { AdminRouter } from './controllers';
import DB from './db';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

DB.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use('/admin', AdminRouter);
app.get('/', (req: Request, res: Response) => {
  res.send('Expresedsss + Typescript');
});

app.listen(port, () => {
  console.log('server is ruwafnnning');
});
