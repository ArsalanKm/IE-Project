import express, { Request, Response } from 'express';

import { ITeacher } from 'models/_';

import { authMiddleware } from '../../middlewares/jwt';
import Teacher from '../../models/teacher';

const router = express.Router();

router.post(
  '/professor',
  authMiddleware,
  async (req: Request, res: Response) => {
    const data = req.body as ITeacher & { id: string };

    const existUser = await Teacher.findOne({
      universityId: data.universityId,
    }).exec();

    if (existUser) {
      res
        .status(400)
        .send({ message: 'Professor exits with same university ID' });
      return;
    }
    try {
      const teacher = await new Teacher({ ...data } as ITeacher).save();
      res
        .status(200)
        .send({ message: 'professor created successfully', data: teacher });
    } catch (error) {
      res.status(500).send({ message: error });
    }
  }
);

router.get(
  '/professors',
  authMiddleware,
  async (req: Request, res: Response) => {
    const data = req.body as { id: string };
    try {
      const professors = await Teacher.find({});
      res.status(200).send({ professors });
    } catch (error) {
      res.status(500).send({ message: 'server error' });
    }
  }
);

router.get(
  '/professor/:id',
  authMiddleware,
  async (req: Request, res: Response) => {
    const data = req.body as { id: string };
    const { id } = req.params;

    try {
      const professor = await Teacher.findById(id).exec();
      res.status(200).send({ professor });
    } catch (error) {
      res.status(500).send({ message: 'server error' });
    }
  }
);

router.delete(
  '/professor/:id',
  authMiddleware,
  async (req: Request, res: Response) => {
    const data = req.body as { id: string };
    const { id } = req.params;

    try {
      const result = await Teacher.findByIdAndDelete(id).exec();
      if (result) {
        res.status(200).send({ data: result, message: 'deleted successfully' });
      } else {
        res
          .status(400)
          .send({ data: result, message: 'teacher does not exits' });
      }
    } catch (error) {
      res.status(500).send({ message: 'server error' });
    }
  }
);

router.put(
  '/professor/:id',
  authMiddleware,
  async (req: Request, res: Response) => {
    const data = req.body as ITeacher & { id: string };
    const { id } = req.params;

    try {
      const existUser = await Teacher.findByIdAndUpdate(id, data).exec();
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
