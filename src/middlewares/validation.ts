import { Request, Response, NextFunction } from 'express';
import { IManager, IPerson, ISubject, ITeacher } from 'models/_';
import {
  IValidation,
  managerDataValidator,
  personDataValidator,
  subjectDataValidator,
  teacherDataValidator,
} from '../utils/validator';

export const requestValidatorMiddleware = (
  model: 'person' | 'teacher' | 'subject' | 'manager',
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let data: IValidation;
  const body = req.body;
  if (!body) {
    res.status(400).send({ message: 'fields are required' });
    return;
  }
  switch (model) {
    case 'person':
      data = personDataValidator(body as IPerson);
      break;
    case 'teacher':
      data = teacherDataValidator(body as ITeacher);
      break;
    case 'subject':
      data = subjectDataValidator(body as ISubject);
      break;
    case 'manager':
      data = managerDataValidator(body as IManager);
      break;
    default:
      data = personDataValidator(body as IManager);
      break;
  }
  if (data?.valid) {
    next();
  } else {
    res.status(400).send({ message: data.message, valid: data.valid });
  }
};
