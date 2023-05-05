import express, { Request, Response } from 'express';

import { updateUtil } from '../utils';
import { authMiddleware } from '../../middlewares/jwt';
import { Subject } from '../../models/subject';

const router = express.Router();

router.get('/courses', authMiddleware, async (req: Request, res: Response) => {
  try {
    const courses = await Subject.find({}).populate('preRequests').exec();
    res.status(200).send({ courses });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
  }
});

router.get(
  '/course/:id',
  authMiddleware,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const course = await Subject.findById(id).exec();
      res.status(200).send({ course });
    } catch (error) {
      res.status(500).send({ message: 'server error' });
    }
  }
);

router.put('/professor/:id', authMiddleware, (req: Request, res: Response) =>
  updateUtil('teacher', req, res)
);

export default router;
