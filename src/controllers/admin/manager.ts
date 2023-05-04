import express, { Request, Response } from 'express';

import { IManager } from 'models/_';

import { authMiddleware } from '../../middlewares/jwt';
import Manager from '../../models/manager';

const router = express.Router();

router.post('/manager', authMiddleware, async (req: Request, res: Response) => {
  const data = req.body as IManager & { id: string };

  const existUser = await Manager.findOne({
    universityId: data.universityId,
  }).exec();

  if (existUser) {
    res.status(400).send({ message: 'manager exits with same university ID' });
    return;
  }
  try {
    const manager = await new Manager({ ...data } as IManager).save();
    res
      .status(200)
      .send({ message: 'manager created successfully', data: manager });
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

router.get('/managers', authMiddleware, async (req: Request, res: Response) => {
  const data = req.body as { id: string };
  try {
    const managers = await Manager.find({});
    res.status(200).send({ managers });
  } catch (error) {
    res.status(500).send({ message: 'server error' });
  }
});

router.get(
  '/manager/:id',
  authMiddleware,
  async (req: Request, res: Response) => {
    const data = req.body as { id: string };
    const { id } = req.params;

    try {
      const manager = await Manager.findById(id).exec();
      res.status(200).send({ manager });
    } catch (error) {
      res.status(500).send({ message: 'server error' });
    }
  }
);

router.delete(
  '/manager/:id',
  authMiddleware,
  async (req: Request, res: Response) => {
    const data = req.body as { id: string };
    const { id } = req.params;

    try {
      const result = await Manager.findByIdAndDelete(id).exec();
      if (result) {
        res.status(200).send({ data: result, message: 'deleted successfully' });
      } else {
        res.status(400).send({ message: 'user does not exists' });
      }
    } catch (error) {
      res.status(500).send({ message: 'server error' });
    }
  }
);

router.put(
  '/manager/:id',
  authMiddleware,
  async (req: Request, res: Response) => {
    const data = req.body as IManager & { id: string };
    const { id } = req.params;

    try {
      const existUser = await Manager.findByIdAndUpdate(id, data);
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
