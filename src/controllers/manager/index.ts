import express, { Request, Response } from 'express';

import { authMiddleware } from '../../middlewares/jwt';

import {
  loginHandler,
  getByIdUtil,
  getListUtil,
  deleteItemUtil,
  updateUtil,
  createUtil,
} from '../utils';

const router = express.Router();

router.post('/login', (req, res) => loginHandler('manager', req, res));

router.get('/courses', authMiddleware, (req: Request, res: Response) =>
  getListUtil('subject', req, res)
);

router.get('/course/:id', authMiddleware, (req: Request, res: Response) =>
  getByIdUtil('subject', req, res)
);

router.get('/student/:id', authMiddleware, (req: Request, res: Response) =>
  getByIdUtil('student', req, res)
);

router.get('/students', authMiddleware, (req: Request, res: Response) =>
  getListUtil('student', req, res)
);

router.get('/professors', authMiddleware, (req: Request, res: Response) =>
  getListUtil('teacher', req, res)
);

router.get('/professor', authMiddleware, (req: Request, res: Response) =>
  getByIdUtil('teacher', req, res)
);

router.delete('/course/:id', authMiddleware, (req: Request, res: Response) =>
  deleteItemUtil('subject', req, res)
);

router.put('/course/:id', authMiddleware, (req: Request, res: Response) =>
  updateUtil('subject', req, res)
);

router.post('/course', authMiddleware, (req: Request, res: Response) =>
  createUtil('subject', req, res)
);

export default router;
