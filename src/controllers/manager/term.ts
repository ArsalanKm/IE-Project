import express, { Request, Response, NextFunction } from 'express';

import { ISemesterSubject, ITerm } from 'models/_';
import { authMiddleware } from '../../middlewares/jwt';
import { authorizationMiddleware } from '../../middlewares/authorization';

import Term from '../../models/term';
import { SemesterSubject } from 'models/subject';

const router = express.Router();

router.get(
  '/terms',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('manager', req, res, next),
  async (req: Request, res: Response) => {
    try {
      const courses = await Term.find({}).populate('termCourses').exec();
      res.status(200).send({ courses });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error });
    }
  }
);

router.get(
  '/term/:id',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('manager', req, res, next),
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const course = await Term.findById(id).populate('termCourses').exec();
      res.status(200).send({ course });
    } catch (error) {
      res.status(500).send({ message: 'server error' });
    }
  }
);

router.delete(
  '/term/:id',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('manager', req, res, next),
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
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('manager', req, res, next),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, termCourses, termUsersId } = req.body as ITerm;
    try {
      const subject = await Term.findByIdAndUpdate(id, {
        name,
        termUsersId,
        termCourses,
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
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('manager', req, res, next),
  async (req: Request, res: Response) => {
    const { name, termCourses, termUsersId } = req.body as ITerm;
    try {
      const term = await new Term({
        name,
        termCourses,
        termUsersId,
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
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('manager', req, res, next),
  async (req: Request, res: Response) => {
    const termId = req.params.id;
    const courseId = req.params.courseId;

    try {
      let course = await SemesterSubject.findById(courseId).exec();
      const term = await Term.findById(termId).exec();
      const termPreRequests = term?.preRequestTermCourses;
      if (course) {
        termPreRequests?.push(course.id);
      }
      res.status(200).send({ message: 'created successfully', term });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error });
    }
  }
);

router.get(
  '/term/:id/preregistration_courses',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) =>
    authorizationMiddleware('manager', req, res, next),
  async (req: Request, res: Response) => {
    const termId = req.params.id;

    try {
      const term = await Term.findById(termId)
        .populate('preRequestTermCourses')
        .exec();
      const termPreRequests =
        term?.preRequestTermCourses as unknown as Array<ISemesterSubject>;

      res.status(200).send({ message: 'created successfully', term });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error });
    }
  }
);

export default router;
