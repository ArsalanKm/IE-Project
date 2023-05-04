import express, { Request, Response } from 'express';

import { IPerson } from 'models/_';

import { loginHandler } from '../login';

import Admin from '../../models/admin';

import professorRouter from './professor';
import studentRouter from './student';
import managerRouter from './manager';

const router = express.Router();

// TO DO admin authorization
router.use(professorRouter);
router.use(studentRouter);
router.use(managerRouter);

router.post('/create-admin', async (req: Request, res: Response) => {
  const { name, password, familyName, universityId, email, phoneNumber } =
    req.body as IPerson;

  try {
    const data = await new Admin({
      name,
      password,
      familyName,
      universityId,
      email,
      phoneNumber,
    }).save();
    if (data) {
      res.status(200).send({ data, message: 'admin created successfully' });
    }
  } catch (error) {
    res.status(500).send({
      message: 'Some error occurred while creating the admin.',
    });
  }
});

router.post('/login', (req: Request, res: Response) =>
  loginHandler('admin', req, res)
);

export default router;
