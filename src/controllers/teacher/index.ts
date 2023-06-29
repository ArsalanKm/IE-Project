import express, { Request, Response, NextFunction } from 'express';

import { updateUtil, loginHandler } from '../utils';
import { authMiddleware } from '../../middlewares/jwt';
import { authorizationMiddleware } from '../../middlewares/authorization';
import { Subject } from '../../models/subject';
import Teacher from '../../models/teacher';
import Term from '../../models/term';
import RegisterRequest from '../../models/register-request';
import { IPreRegisterRequests, ISemesterSubject } from 'models/_';

const router = express.Router();

router.post('/login', (req, res) => loginHandler('teacher', req, res));

router.get(
  '/courses',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('teacher', req, res, next),
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      if (userId) {
        const teacher = await Teacher.findById(userId).exec();

        const courses = await Subject.find({})
          .where({
            field: teacher?.field,
          })
          .populate('preRequests')
          .exec();
        res.status(200).send({ courses });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error });
    }
  }
);

router.get(
  '/course/:id',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('teacher', req, res, next),
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

router.get(
  '/all-courses',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('teacher', req, res, next),
  async (req: Request, res: Response) => {
    const { field } = req.query;
    try {
      const courses = field
        ? await Subject.find({})
            .where({
              field: field as string,
            })
            .populate('preRequests')
            .exec()
        : await Subject.find({}).populate('preRequests').exec();
      res.status(200).send({ courses });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error });
    }
  }
);

router.put(
  '/:id',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('teacher', req, res, next),
  (req: Request, res: Response) => updateUtil('teacher', req, res, true)
);

router.get(
  '/terms',
  // authMiddleware,
  // (req: Request, res: Response, next: NextFunction) =>
  //   authorizationMiddleware('manager', req, res, next),
  async (req: Request, res: Response) => {
    try {
      const terms = await Term.find({})
        .populate(['termCourses', 'preRegistrationCourses'])
        .exec();
      res.status(200).send({ terms });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error });
    }
  }
);
router.get(
  '/term/:id/registrations',
  // authMiddleware,
  // (req: Request, res: Response, next: NextFunction) =>
  //   authorizationMiddleware('manager', req, res, next),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const requests = await RegisterRequest.find({ term: id })
        .populate(['courses'])
        .exec();
      if (requests) {
        res.status(200).send({ requests });
      } else {
        res.status(400).send({ message: 'term not found' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error });
    }
  }
);

router.get(
  '/term/:id/course/:courseId/registrations',
  // authMiddleware,
  // (req: Request, res: Response, next: NextFunction) =>
  //   authorizationMiddleware('manager', req, res, next),
  async (req: Request, res: Response) => {
    try {
      const { id, courseId } = req.params;
      const requests = await RegisterRequest.find({}).exec();
      if (requests) {
        res.status(200).send({ requests });
      } else {
        res.status(400).send({ message: 'register for term not found' });
      }

      const term = await Term.findById(id).populate('termCourses').exec();
      const course = (
        term?.termCourses as unknown as Array<ISemesterSubject>
      ).find((el) => el.id === courseId);

      if (!course) {
        res.status(400).send({ message: 'coures not found in term courses' });
        return;
      }

      const response = (
        requests as unknown as Array<IPreRegisterRequests>
      ).filter((el) => el.courses.find((el) => el.id === courseId));

      res.status(200).send({ response });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error });
    }
  }
);

router.put(
  '/registration/:id',
  // authMiddleware,
  // (req: Request, res: Response, next: NextFunction) =>
  //   authorizationMiddleware('manager', req, res, next),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const update = await RegisterRequest.findByIdAndUpdate(id, {
        confirm: true,
      }).exec();
      if (update) {
        res.status(200).send({ message: 'updated successfully' });
      } else {
        res.status(400).send({ message: 'registration not found' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error });
    }
  }
);

export default router;
