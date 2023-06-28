import express, { Request, Response, NextFunction } from 'express';

import { authMiddleware } from '../../middlewares/jwt';
import { authorizationMiddleware } from '../../middlewares/authorization';

import {
  createUtil,
  deleteItemUtil,
  getByIdUtil,
  getListUtil,
  updateUtil,
} from '../utils';

const router = express.Router();

router.get(
  '/professors',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('admin', req, res, next),
  (req: Request, res: Response) => getListUtil('teacher', req, res)
);

router.get(
  '/professor/:id',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('admin', req, res, next),
  (req: Request, res: Response) => getByIdUtil('teacher', req, res)
);

router.delete(
  '/professor/:id',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('admin', req, res, next),
  (req: Request, res: Response) => deleteItemUtil('teacher', req, res)
);

router.post(
  '/professor',
  // authMiddleware,
  // (req: Request, res: Response, next: NextFunction) =>
  //   authorizationMiddleware('admin', req, res, next),
  async (req: Request, res: Response) => createUtil('teacher', req, res)
);
router.put(
  '/professor/:id',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('admin', req, res, next),
  (req: Request, res: Response) => updateUtil('teacher', req, res)
);

export default router;
