import express, { Request, Response } from 'express';

import { IManager } from 'models/_';

import { authMiddleware } from '../../middlewares/jwt';
import Manager from '../../models/manager';
import {
  createUtil,
  updateUtil,
  deleteItemUtil,
  getByIdUtil,
  getListUtil,
} from '../utils';

const router = express.Router();

router.post('/manager', authMiddleware, (req: Request, res: Response) =>
  createUtil('manager', req, res)
);

router.get('/managers', authMiddleware, async (req: Request, res: Response) =>
  getListUtil('manager', req, res)
);

router.get('/manager/:id', authMiddleware, (req: Request, res: Response) =>
  getByIdUtil('manager', req, res)
);

router.delete('/manager/:id', authMiddleware, (req: Request, res: Response) =>
  deleteItemUtil('manager', req, res)
);

router.put('/manager/:id', authMiddleware, (req: Request, res: Response) =>
  updateUtil('manager', req, res)
);

export default router;
