import express, { Request, Response } from 'express';

import { createUtil, loginHandler } from '../utils';

import professorRouter from './professor';
import studentRouter from './student';
import managerRouter from './manager';


const router = express.Router();

// TO DO admin authorization
router.use(professorRouter);
router.use(studentRouter);
router.use(managerRouter);

router.post('/create-admin', async (req: Request, res: Response) =>
  createUtil('admin', req, res)
);

router.post('/login', (req: Request, res: Response) =>
  loginHandler('admin', req, res)
);

export default router;
