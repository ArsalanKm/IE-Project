import mongoose from 'mongoose';

import { passwordMiddleware, PersonSchemaType } from './_';

const adminSchema = passwordMiddleware(
  new mongoose.Schema(
    {
      ...PersonSchemaType,
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

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
