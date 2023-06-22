import express, { Request, Response, NextFunction } from 'express';

import { createUtil, loginHandler, getListUtil, getByIdUtil } from '../utils';

import { authMiddleware } from '../../middlewares/jwt';
import { authorizationMiddleware } from '../../middlewares/authorization';

const router = express.Router();

router.get(
  '/professors',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('manager', req, res, next),
  (req: Request, res: Response) => getListUtil('teacher', req, res)
);

router.get(
  '/professor/:id',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('manager', req, res, next),
  (req: Request, res: Response) => getByIdUtil('teacher', req, res)
);
