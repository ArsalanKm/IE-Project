import express, { Request, Response, NextFunction } from 'express';

import { ISemesterSubject, ITerm } from 'models/_';
import { authMiddleware } from '../../middlewares/jwt';
import { authorizationMiddleware } from '../../middlewares/authorization';

import Term from '../../models/term';
import { SemesterSubject } from '../../models/subject';
import RegisterRequest from '../../models/register-request';

const router = express.Router();

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
  '/term/:id',
  // authMiddleware,
  // (req: Request, res: Response, next: NextFunction) =>
  //   authorizationMiddleware('manager', req, res, next),
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const course = await Term.findById(id)
        .populate(['termCourses', 'preRegistrationCourses'])
        .exec();
      res.status(200).send({ course });
    } catch (error) {
      res.status(500).send({ message: 'server error' });
    }
  }
);

router.delete(
  '/term/:id',
  // authMiddleware,
  // (req: Request, res: Response, next: NextFunction) =>
  //   authorizationMiddleware('manager', req, res, next),
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const result = await Term.findByIdAndDelete(id).exec();
      if (result) {
        res.status(200).send({ data: result, message: 'deleted successfully' });
      } else {
        res.status(400).send({ message: 'course does not exists' });
      }
    } catch (error) {
      res.status(500).send({ message: 'server error' });
    }
  }
);

router.put(
  '/term/:id',
  // authMiddleware,
  // (req: Request, res: Response, next: NextFunction) =>
  //   authorizationMiddleware('manager', req, res, next),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, termCourses, termUsersId, preRegistrationCourses } =
      req.body as ITerm;
    try {
      const subject = await Term.findByIdAndUpdate(id, {
        name,
        termUsersId,
        termCourses,
        preRegistrationCourses,
      }).exec();

      if (!subject) {
        res.status(400).send({ message: 'There is no course with that id' });
      }
      res.status(200).send({ message: 'updated successfully', subject });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error });
    }
  }
);

router.post(
  '/term',
  // authMiddleware,
  // (req: Request, res: Response, next: NextFunction) =>
  //   authorizationMiddleware('manager', req, res, next),
  async (req: Request, res: Response) => {
    const { name, termCourses, termUsersId, preRegistrationCourses } =
      req.body as ITerm;
    try {
      const term = await new Term({
        name,
        termCourses,
        termUsersId,
        preRegistrationCourses,
      }).save();
      res.status(200).send({ message: 'created successfully', term });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error });
    }
  }
);

router.post(
  '/term/:id/preregistration/:courseId',
  // authMiddleware,
  // (req: Request, res: Response, next: NextFunction) =>
  //   authorizationMiddleware('manager', req, res, next),
  async (req: Request, res: Response) => {
    const termId = req.params.id;
    const courseId = req.params.courseId;

    try {
      let course = await SemesterSubject.findById(courseId).exec();
      const term = await Term.findById(termId).exec();
      const termPreRequests = term?.preRegistrationCourses;
      if (course) {
        termPreRequests?.push(course.id);
      }
      await Term.findByIdAndUpdate(termId, {
        preRegistrationCourses: termPreRequests,
      });
      res.status(200).send({ message: 'created successfully', term });
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
    const termId = req.params.id;

    try {
      const term = await Term.findById(termId)
        .populate('preRegistrationCourses')
        .exec();
      console.log(term);

      const termPreRequests =
        term?.preRegistrationCourses as unknown as Array<ISemesterSubject>;

      res.status(200).send({ courses: termPreRequests });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error });
    }
  }
);

router.delete(
  '/term/:id/preregistration/:courseId',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('manager', req, res, next),
  async (req: Request, res: Response) => {
    const termId = req.params.id;
    const courseId = req.params.courseId;

    try {
      let course = await SemesterSubject.findById(courseId).exec();
      const term = await Term.findById(termId).exec();
      const termPreRegistrationCourses = term?.preRegistrationCourses;
      if (course) {
        const index = termPreRegistrationCourses?.findIndex(course.id);
        if (index && index > -1) {
          termPreRegistrationCourses?.splice(index, 1);
        }
        await Term.findByIdAndUpdate(termId, {
          termPreRegistrationCourses: termPreRegistrationCourses,
        }).exec();
      }
      res.status(200).send({
        message: 'deleted successfully',
        termPreRegistrationCourses: termPreRegistrationCourses,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error });
    }
  }
);

router.post(
  '/term/:id/course/register/:courseId',
  // authMiddleware,
  // (req: Request, res: Response, next: NextFunction) =>
  //   authorizationMiddleware('manager', req, res, next),
  async (req: Request, res: Response) => {
    const termId = req.params.id;
    const courseId = req.params.courseId;

    try {
      let course = await SemesterSubject.findById(courseId).exec();
      const term = await Term.findById(termId).exec();
      const termCourses = term?.termCourses;
      if (course) {
        termCourses?.push(course.id);
      }
      await Term.findByIdAndUpdate(termId, {
        termCourses,
      });
      res.status(200).send({ message: 'created successfully', term });
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
    const termId = req.params.id;

    try {
      const term = await Term.findById(termId).populate('termCourses').exec();
      const termCourses =
        term?.termCourses as unknown as Array<ISemesterSubject>;

      res.status(200).send({ courses: termCourses });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error });
    }
  }
);

router.delete(
  '/term/:id/course/register/:courseId',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('manager', req, res, next),
  async (req: Request, res: Response) => {
    const termId = req.params.id;
    const courseId = req.params.courseId;

    try {
      let course = await SemesterSubject.findById(courseId).exec();
      const term = await Term.findById(termId).exec();
      const termCourses = term?.termCourses;
      if (course) {
        const index = termCourses?.findIndex(course.id);
        if (index && index > -1) {
          termCourses?.splice(index, 1);
        }
        await Term.findByIdAndUpdate(termId, {
          termPreRegistrationCourses: termCourses,
        }).exec();
      }
      res.status(200).send({
        message: 'deleted successfully',
        termPreRegistrationCourses: termCourses,
      });
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
