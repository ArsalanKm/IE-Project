import express, { Request, Response, NextFunction } from 'express';

import { authMiddleware } from '../../middlewares/jwt';
import { authorizationMiddleware } from '../../middlewares/authorization';

import {
  createUtil,
  updateUtil,
  deleteItemUtil,
  getByIdUtil,
  getListUtil,
} from '../utils';

const router = express.Router();

router.post(
  '/student',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('student', req, res, next),
  (req: Request, res: Response) => createUtil('student', req, res)
);

router.get(
  '/students',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('student', req, res, next),
  (req: Request, res: Response) => getListUtil('student', req, res)
);

router.get(
  '/student/:id',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('student', req, res, next),
  (req: Request, res: Response) => getByIdUtil('student', req, res)
);

router.delete(
  '/student/:id',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('student', req, res, next),
  (req: Request, res: Response) => deleteItemUtil('student', req, res)
);

router.put(
  '/student/:id',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('student', req, res, next),
  (req: Request, res: Response) => updateUtil('student', req, res)
);

export default router;
