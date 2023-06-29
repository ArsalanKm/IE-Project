import express, { Request, Response, NextFunction } from 'express';

import { authMiddleware } from '../../middlewares/jwt';
import { authorizationMiddleware } from '../../middlewares/authorization';
import { loginHandler, updateUtil } from '../utils';
import { Subject } from '../../models/subject';
import Student from '../../models/student';
import Term from '../../models/term';
import PreRegisterRequests from '../../models/pre-register-request';
import { ISemesterSubject, IPreRegisterRequests } from 'models/_';
import RegisterRequest from '../../models/register-request';

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

// TODO check this
router.post(
  '/term/:id/preregister/:courseId',
  // authMiddleware,
  // (req: Request, res: Response, next: NextFunction) =>
  //   authorizationMiddleware('manager', req, res, next),
  async (req: Request, res: Response) => {
    try {
      const { id, courseId } = req.params;

      const term = await Term.findById(id)
        .populate('preRegistrationCourses')
        .exec();
      if (term) {
        const courses =
          term.preRegistrationCourses as unknown as Array<ISemesterSubject>;
        console.log(courses);
        console.log(courseId);

        if (!courses.find((el) => el.id === courseId)) {
          res.status(400).send({ message: 'course not found in term' });
          return;
        }

        const existedPreRequest = await PreRegisterRequests.find({
          student: req.body.userId,
        }).exec();

        if (existedPreRequest && existedPreRequest.length > 0) {
          console.log(existedPreRequest);
          const request = existedPreRequest as unknown as IPreRegisterRequests;
          await PreRegisterRequests.findByIdAndUpdate(request.id, {
            student: req.body.userId,
            courses: (
              existedPreRequest as unknown as IPreRegisterRequests
            ).courses
              ?.map((el) => el.id)
              .push(courseId),
          }).exec();

          res.status(200).send({
            message: 'course added to existed pre-registration request',
          });
          console.log('here');
        } else {
          await new PreRegisterRequests({
            term: id,
            student: req.body.userId,
            courses: [courseId],
          }).save();
          res
            .status(200)
            .send({ message: 'new pre-registration created with new course' });
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

// TODO check this
router.delete(
  '/term/:id/preregister/:courseId',
  // authMiddleware,
  // (req: Request, res: Response, next: NextFunction) =>
  //   authorizationMiddleware('manager', req, res, next),
  async (req: Request, res: Response) => {
    try {
      const { id, courseId } = req.params;

      const term = await Term.findById(id)
        .populate('preRegistrationCourses')
        .exec();
      if (term) {
        const courses =
          term.preRegistrationCourses as unknown as Array<ISemesterSubject>;
        if (!courses.find((el) => el.id === courseId)) {
          res.status(400).send({ message: 'course not found in term' });
        }
        // console.log(req.body.userId);

        const existedPreRequest = await PreRegisterRequests.findOne({
          student: req.body.userId,
        })
          .populate('courses')
          .exec();
        if (existedPreRequest) {
          const request = existedPreRequest as unknown as IPreRegisterRequests;
          await PreRegisterRequests.findByIdAndUpdate(request.id, {
            student: req.body.userId,
            courses: request.courses?.filter((el) => el.id !== courseId),
          }).exec();
          res.status(200).send({
            message: 'course deleted from pre-registration request',
          });
        } else {
          res.status(400).send({ message: 'pre-register not found' });
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

router.get(
  '/term/:id/preregistrations',
  // authMiddleware,
  // (req: Request, res: Response, next: NextFunction) =>
  //   authorizationMiddleware('manager', req, res, next),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const requests = await PreRegisterRequests.find({ term: id })
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
  '/term/:id/register/:courseId',
  // authMiddleware,
  // (req: Request, res: Response, next: NextFunction) =>
  //   authorizationMiddleware('manager', req, res, next),
  async (req: Request, res: Response) => {
    try {
      const { id, courseId } = req.params;

      const term = await Term.findById(id).populate('termCourses').exec();
      if (term) {
        const courses = term.termCourses as unknown as Array<ISemesterSubject>;

        if (!courses.find((el) => el.id === courseId)) {
          res.status(400).send({ message: 'course not found in term' });
          return;
        }

        const existedPreRequest = await RegisterRequest.find({
          student: req.body.userId,
        }).exec();

        if (existedPreRequest && existedPreRequest.length > 0) {
          console.log(existedPreRequest);
          const request = existedPreRequest as unknown as IPreRegisterRequests;
          await RegisterRequest.findByIdAndUpdate(request.id, {
            student: req.body.userId,
            courses: (
              existedPreRequest as unknown as IPreRegisterRequests
            ).courses
              ?.map((el) => el.id)
              .push(courseId),
          }).exec();

          res.status(200).send({
            message: 'course added to existed registration request',
          });
          console.log('here');
        } else {
          await new RegisterRequest({
            term: id,
            student: req.body.userId,
            courses: [courseId],
          }).save();
          res
            .status(200)
            .send({ message: 'new registration created with new course' });
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

// TODO check this
router.delete(
  '/term/:id/register/:courseId',
  // authMiddleware,
  // (req: Request, res: Response, next: NextFunction) =>
  //   authorizationMiddleware('manager', req, res, next),
  async (req: Request, res: Response) => {
    try {
      const { id, courseId } = req.params;

      const term = await Term.findById(id).populate('termCourses').exec();
      if (term) {
        const courses = term.termCourses as unknown as Array<ISemesterSubject>;
        if (!courses.find((el) => el.id === courseId)) {
          res.status(400).send({ message: 'course not found in term' });
        }
        // console.log(req.body.userId);

        const existedPreRequest = await RegisterRequest.findOne({
          student: req.body.userId,
        })
          .populate('courses')
          .exec();
        if (existedPreRequest) {
          const request = existedPreRequest as unknown as IPreRegisterRequests;
          await RegisterRequest.findByIdAndUpdate(request.id, {
            student: req.body.userId,
            courses: request.courses?.filter((el) => el.id !== courseId),
          }).exec();
          res.status(200).send({
            message: 'course deleted registration request',
          });
        } else {
          res.status(400).send({ message: 'register not found' });
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
