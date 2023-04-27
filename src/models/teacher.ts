import mongoose from 'mongoose';

import { passwordMiddleware, PersonSchemaType } from './_';

const teacherSchema = passwordMiddleware(
  new mongoose.Schema({
    ...PersonSchemaType,
    faculty: { type: String, required: true },
    field: { type: String, required: true },
    rank: { type: Number, required: true },
  })
);

const Teacher = mongoose.model('Teacher', teacherSchema);

export default Teacher;
