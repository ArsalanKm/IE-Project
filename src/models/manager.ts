import mongoose from 'mongoose';

import { PersonSchemaType } from './_';

const managerSchema = new mongoose.Schema({
  ...PersonSchemaType,
  faculty: { type: String, required: true },
});

const Manager = mongoose.model('Manager', managerSchema);

export default Manager;
