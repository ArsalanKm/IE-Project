import express, { Request, Response, NextFunction } from 'express';

import { authMiddleware } from '../../middlewares/jwt';
import { authorizationMiddleware } from '../../middlewares/authorization';
import { loginHandler, updateUtil } from '../utils';
import { Subject } from '../../models/subject';
import Student from '../../models/student';
import Term from '../../models/term';
import PreRegisterRequests from '../../models/pre-register-request';
import { ISemesterSubject, IPreRegisterRequests } from 'models/_';

const router = express.Router();

router.post('/login', (req, res) => loginHandler('student', req, res));

router.get(
  '/courses',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('student', req, res, next),
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      if (userId) {
        const student = await Student.findById(userId).exec();

        const courses = await Subject.find({})
          .where({
            field: student?.field,
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
  '/all-courses',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('student', req, res, next),
  async (req: Request, res: Response) => {
    const { field } = req.query;

    try {
      const courses = field
        ? await Subject.find({ field }).populate('preRequests').exec()
        : await Subject.find({}).populate('preRequests').exec();
      res.status(200).send({ courses });
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
    authorizationMiddleware('student', req, res, next),
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

router.put(
  '/:id',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('student', req, res, next),
  (req: Request, res: Response) => updateUtil('student', req, res, true)
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
  '/term/:id/preregistration_courses',
  // authMiddleware,
  // (req: Request, res: Response, next: NextFunction) =>
  //   authorizationMiddleware('manager', req, res, next),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const term = await Term.findById(id)
        .populate('preRegistrationCourses')
        .exec();
      if (term) {
        res
          .status(200)
          .send({ preRegistrationCourses: term?.preRegistrationCourses });
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
  '/term/:id/registration_courses',
  // authMiddleware,
  // (req: Request, res: Response, next: NextFunction) =>
  //   authorizationMiddleware('manager', req, res, next),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const term = await Term.findById(id).populate('termCourses').exec();
      if (term) {
        res.status(200).send({ termCourses: term?.termCourses });
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
  '/term/:id/registration_courses',
  // authMiddleware,
  // (req: Request, res: Response, next: NextFunction) =>
  //   authorizationMiddleware('manager', req, res, next),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const term = await Term.findById(id).populate('termCourses').exec();
      if (term) {
        res.status(200).send({ termCourses: term?.termCourses });
      } else {
        res.status(400).send({ message: 'term not found' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error });
    }
  }
);
// TODO check this
router.post(
  '/term/:id/preregister/:courseId',
  // authMiddleware,
  // (req: Request, res: Response, next: NextFunction) =>
  //   authorizationMiddleware('manager', req, res, next),
  async (req: Request, res: Response) => {
    try {
      const { id, courseId } = req.params;

      const term = await Term.findById(id).populate('termCourses').exec();
      if (term) {
        const courses =
          term.preRegistrationCourses as unknown as Array<ISemesterSubject>;
        if (!courses.find((el) => el.id === courseId)) {
          res.status(400).send({ message: 'course not found in term' });
        }
        const existedPreRequest = await PreRegisterRequests.find({
          student: req.body.userId,
        }).exec();
        if (existedPreRequest) {
          const request = existedPreRequest as unknown as IPreRegisterRequests;
          await PreRegisterRequests.findByIdAndUpdate(request.id, {
            student: req.body.userId,
            courses: (
              existedPreRequest as unknown as IPreRegisterRequests
            ).courses
              .map((el) => el.id)
              .push(courseId),
          }).exec();
        } else {
          await new PreRegisterRequests({
            term: id,
            student: req.body.userId,
            courses: [courseId],
          }).save();
        }
      } else {
        res.status(400).send({ message: 'term not found' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error });
    }
  }
);
export default router;
