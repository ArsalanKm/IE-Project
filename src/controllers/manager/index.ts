import express from 'express';

import { loginHandler } from '../utils';
import studentRouter from './student';
import professorRouter from './student';
import courseRouter from './student';
import termRouter from './term';

const router = express.Router();

router.use(studentRouter);
router.use(professorRouter);
router.use(termRouter);
router.use(courseRouter);

router.post('/login', (req, res) => loginHandler('manager', req, res));

export default router;
