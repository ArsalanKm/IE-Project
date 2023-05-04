import express, { Request, Response } from 'express';

import { ITeacher } from 'models/_';

import { getByIdUtil, getListUtil } from '../utils';
import { authMiddleware } from '../../middlewares/jwt';
import Teacher from '../../models/teacher';

const router = express.Router();

router.get('/courses', authMiddleware, (req: Request, res: Response) =>
  getListUtil('subject', req, res)
);

router.get('/course/:id', authMiddleware, (req: Request, res: Response) =>
  getByIdUtil('subject', req, res)
);

router.put(
  '/professor/:id',
  authMiddleware,
  async (req: Request, res: Response) => {
    const data = req.body as ITeacher & { id: string };
    const { id } = req.params;

    try {
      const existUser = await Teacher.findByIdAndUpdate(id, data);
      if (!existUser) {
        res.status(400).send({ message: 'There is no user with that id' });
      }
      res.status(200).send(existUser);
    } catch (error) {
      res.status(500).send({ message: 'server error' });
    }
  }
);

export default router;
