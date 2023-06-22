import mongoose from 'mongoose';

import { passwordMiddleware, PersonSchemaType } from './_';

const managerSchema = passwordMiddleware(
  new mongoose.Schema(
    {
      ...PersonSchemaType,
      faculty: { type: String, required: true },
    },
    {
      toJSON: {
        transform(doc, ret) {
          ret.id = ret._id;
          delete ret._id;
        },
      },
    }
  )
);

const Manager = mongoose.model('Manager', managerSchema);

export default Manager;
