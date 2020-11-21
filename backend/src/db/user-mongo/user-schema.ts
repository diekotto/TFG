import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  active: Boolean,
  // permissions: [String], // TODO: SIN HACER #9
  accessHistory: [Date],
  actionsHistory: [
    {
      date: Date,
      action: String,
    },
  ],
  checkIn: String,
  checkOut: String,
  comments: [
    {
      author: String,
      comment: String,
    },
  ],
});

export interface UserComment {
  author: string;
  comment: string;
}

export interface UserAction {
  date: Date;
  action: string;
}

export interface UserDocument extends Document {
  name: string;
  email: string;
  active: boolean;
  // permissions: string[]; // TODO: SIN HACER #9
  accessHistory: Date[];
  actionsHistory: UserAction[];
  checkIn: string; // 'HH:ss'
  checkOut: string; // 'HH:ss'
  comments: UserComment[];
}
