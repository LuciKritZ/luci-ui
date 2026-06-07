import { Mongoose } from 'mongoose';

declare global {
  var mongoose: {
    conn: Mongoose | null;
    promise: null | Promise<Mongoose>;
  };
}
