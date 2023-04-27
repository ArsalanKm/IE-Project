import mongoose from 'mongoose';

import { PersonSchemaType } from './_';

const teacherSchema = new mongoose.Schema({
  ...PersonSchemaType,
  faculty: { type: String, required: true },
  field: { type: String, required: true },
  rank: { type: String, required: true },
});

const Teacher = mongoose.model('Teacher', teacherSchema);

export default Teacher;
