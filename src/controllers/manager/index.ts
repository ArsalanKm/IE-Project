import express from 'express';

import { loginHandler } from '../utils';
import studentRouter from './student';
import professorRouter from './professor';
import courseRouter from './course';
import termRouter from './term';

const router = express.Router();

router.use(studentRouter);
router.use(professorRouter);
router.use(termRouter);
router.use(courseRouter);

router.post('/login', (req, res) => loginHandler('manager', req, res));

export default router;
