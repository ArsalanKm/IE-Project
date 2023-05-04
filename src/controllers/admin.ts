import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import Admin from '../models/admin';

import { IPerson } from 'models/_';

const router = express.Router();

router.post('/create-admin', async (req: Request, res: Response) => {
  const body = req.body as IPerson;
  let data;
  try {
    data = await new Admin({
      name: body.name,
      password: body.password,
      familyName: body.familyName,
      universityId: body.universityId,
      email: body.email,
      phoneNumber: body.phoneNumber,
    }).save();
  } catch (error) {
    res.status(500).send({
      message: 'Some error occurred while creating the admin.',
    });
  }
  let token;
  try {
    token = jwt.sign({ name: body.name, password: body.password }, 'secret', {
      expiresIn: '100d',
    });
  } catch (error) {
    res.status(500).send({
      message: 'something went run while creating token',
    });
  }
  res.status(200).send({ data, message: 'admin created successfull=y', token });
});

export default router;
