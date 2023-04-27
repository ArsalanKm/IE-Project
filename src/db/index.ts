import mongoose from 'mongoose';

const connectionString = 'mongodb://0.0.0.0:27017/';

mongoose
  .connect(connectionString, { dbName: 'mern-app' })
  .then(() => console.log('successfully connected to database'))
  .catch((e) => console.error('Connection error to database', e));

const db = mongoose.connection;

export default db;
