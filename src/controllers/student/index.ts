import express, { Request, Response } from 'express';

import { IStudent } from 'models/_';

import { authMiddleware } from '../../middlewares/jwt';
import Student from '../../models/student';
import { loginHandler, getByIdUtil, getListUtil, updateUtil } from '../utils';

const router = express.Router();

router.post('/login', (req, res) => loginHandler('student', req, res));

router.get('/courses', authMiddleware, (req: Request, res: Response) =>
  getListUtil('subject', req, res)
);

router.get('/course/:id', authMiddleware, (req: Request, res: Response) =>
  getByIdUtil('subject', req, res)
);

router.put('/student/:id', authMiddleware, (req: Request, res: Response) =>
  updateUtil('student', req, res)
);

export default router;
