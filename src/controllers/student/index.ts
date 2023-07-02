import express, { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import { authMiddleware } from '../../middlewares/jwt';
import { authorizationMiddleware } from '../../middlewares/authorization';
import { loginHandler, updateUtil } from '../utils';
import { SemesterSubject, Subject } from '../../models/subject';
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
      res.status(200).send({ data: terms });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error });
    }
  }
);

router.get(
  '/term/:id',
  // authMiddleware,
  // (req: Request, res: Response, next: NextFunction) =>
  //   authorizationMiddleware('manager', req, res, next),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const term = await Term.findById(id).exec();
      if (term) {
        res.status(200).send({ data: term });
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
        res.status(200).send({ data: term?.preRegistrationCourses });
      } else {
        res.status(400).send({ data: 'term not found' });
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
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('student', req, res, next),
  async (req: Request, res: Response) => {
    try {
      const { id, courseId } = req.params;
      console.log(req.body.userId);

      const term = await Term.findById(id)
        .populate('preRegistrationCourses')
        .exec();
      if (term) {
        const courses =
          term.preRegistrationCourses as unknown as Array<ISemesterSubject>;

        if (!courses.find((el) => el.id === courseId)) {
          res.status(400).send({ message: 'course not found in term' });
          return;
        }
        const existedPreRequest = await PreRegisterRequests.findOne({
          student: req.body.userId,
        }).exec();

        if (existedPreRequest) {
          const existedCourse = await SemesterSubject.findByIdAndUpdate(
            courseId
          ).exec();

          const existedPreRegisterStudents = existedCourse?.preRegisterStudents;
          if (
            existedPreRegisterStudents?.length === 0 ||
            existedPreRegisterStudents?.find(
              (el) => el.toString() !== req.body.userId
            )
          ) {
            existedPreRegisterStudents?.push(req.body.userId);
          }

          await SemesterSubject.findByIdAndUpdate(courseId, {
            preRegisterStudents: existedPreRegisterStudents,
          }).exec();

          const request = existedPreRequest as unknown as IPreRegisterRequests;
          existedPreRequest?.courses?.push(courseId);

          await PreRegisterRequests.findByIdAndUpdate(request.id, {
            courses: existedPreRequest.courses,
          }).exec();

          res.status(200).send({
            message: 'course added to existed pre-registration request',
          });
        } else {
          await SemesterSubject.findByIdAndUpdate(courseId, {
            $push: { preRegisterStudents: req.body.userId },
            // registerStudents: existedRegisterStudents,
          }).exec();
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
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('student', req, res, next),
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
          return;
        }
        // console.log(req.body.userId);

        const existedPreRequest = await PreRegisterRequests.findOne({
          term: id,
          student: req.body.userId,
        })
          .populate('courses')
          .exec();
        if (existedPreRequest) {
          const request = existedPreRequest as unknown as IPreRegisterRequests;
          await PreRegisterRequests.findByIdAndUpdate(request.id, {
            courses: request.courses?.filter((el) => el.id !== courseId),
          }).exec();
          await SemesterSubject.findByIdAndUpdate(courseId, {
            $pull: { preRegisterStudents: req.body.userId },
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
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('student', req, res, next),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const requests = await PreRegisterRequests.find({
        // term: id,
        student: req.body.userId,
      })
        .populate(['courses'])
        .exec();
      if (requests) {
        res.status(200).send({ data: requests });
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
        res.status(200).send({ data: term?.termCourses });
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
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('student', req, res, next),
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

        const existedPreRequest = await RegisterRequest.findOne({
          term: id,
          student: req.body.userId,
        }).exec();

        if (existedPreRequest) {
          const existedCourse = await SemesterSubject.findByIdAndUpdate(
            courseId
          ).exec();

          const existedRegisterStudents = existedCourse?.registerStudents;
          if (
            existedRegisterStudents?.length === 0 ||
            existedRegisterStudents?.find(
              (el) => el.toString() !== req.body.userId
            )
          ) {
            existedRegisterStudents?.push(req.body.userId);
          }
          await SemesterSubject.findByIdAndUpdate(courseId, {
            registerStudents: existedRegisterStudents,
          }).exec();

          const request = existedPreRequest as unknown as IPreRegisterRequests;
          existedPreRequest?.courses?.push(courseId);
          console.log(existedPreRequest);

          await RegisterRequest.findByIdAndUpdate(request.id, {
            courses: existedPreRequest.courses,
          }).exec();

          res.status(200).send({
            message: 'course added to existed registration request',
          });
          console.log('here');
        } else {
          await SemesterSubject.findByIdAndUpdate(courseId, {
            $push: { registerStudents: req.body.userId },
            // registerStudents: existedRegisterStudents,
          }).exec();
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
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('student', req, res, next),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const requests = await RegisterRequest.find({
        term: id,
        student: req.body.userId,
      })
        .populate(['courses'])
        .exec();
      if (requests) {
        res.status(200).send({ data: requests });
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
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('student', req, res, next),
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
            courses: request.courses?.filter((el) => el.id !== courseId),
          }).exec();
          await SemesterSubject.findByIdAndUpdate(courseId, {
            $pull: { registerStudents: req.body.userId },
          }).exec();
          res.status(200).send({
            message: 'course deleted registration request',
          });
        } else {
          res.status(400).send({ message: 'register not found' });
          return;
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
