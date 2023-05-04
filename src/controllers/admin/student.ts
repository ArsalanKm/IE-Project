import express, { Request, Response } from 'express';

import { IStudent } from 'models/_';

import { authMiddleware } from '../../middlewares/jwt';
import Student from '../../models/student';
import {
  createUtil,
  updateUtil,
  deleteItemUtil,
  getByIdUtil,
  getListUtil,
} from '../utils';

const router = express.Router();

router.post('/student', authMiddleware, (req: Request, res: Response) =>
  createUtil('student', req, res)
);

router.get('/students', authMiddleware, (req: Request, res: Response) =>
  getListUtil('student', req, res)
);

router.get('/student/:id', authMiddleware, (req: Request, res: Response) =>
  getByIdUtil('student', req, res)
);

router.delete('/student/:id', authMiddleware, (req: Request, res: Response) =>
  deleteItemUtil('student', req, res)
);

router.put('/student/:id', authMiddleware, (req: Request, res: Response) =>
  updateUtil('student', req, res)
);

export default router;
