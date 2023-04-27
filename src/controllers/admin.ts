import express, { Request, Response } from 'express';

import Admin from '../models/admin';

import { IPerson } from 'models/_';

const router = express.Router();

router.post('/create-admin', (req: Request, res: Response) => {
  const body = req.body as IPerson;

  new Admin({
    name: body.name,
    password: body.password,
    familyName: body.familyName,
    universityId: body.universityId,
    email: body.email,
    phoneNumber: body.phoneNumber,
  })
    .save()
    .then((data) =>
      res.status(200).send({ data, message: 'admin created successfull=y' })
    )
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Tutorial.',
      });
    });
});

export default router;
