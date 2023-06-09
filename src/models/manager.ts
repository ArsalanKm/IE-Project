import mongoose from 'mongoose';

import { passwordMiddleware, PersonSchemaType } from './_';

const managerSchema = passwordMiddleware(
  new mongoose.Schema({
    ...PersonSchemaType,
    faculty: { type: String, required: true },
  })
);

const Manager = mongoose.model('Manager', managerSchema);

export default Manager;
