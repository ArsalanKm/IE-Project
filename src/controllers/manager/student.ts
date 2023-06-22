import express, { Request, Response, NextFunction } from 'express';

import { createUtil, loginHandler, getListUtil, getByIdUtil } from '../utils';

import { authMiddleware } from '../../middlewares/jwt';
import { authorizationMiddleware } from '../../middlewares/authorization';

const router = express.Router();
router.get(
  '/student/:id',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('manager', req, res, next),
  (req: Request, res: Response) => getByIdUtil('student', req, res)
);

router.get(
  '/students',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('manager', req, res, next),
  (req: Request, res: Response) => getListUtil('student', req, res)
);

export default router;
