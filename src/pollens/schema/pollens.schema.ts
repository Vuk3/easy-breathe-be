import { Schema, Document } from 'mongoose';

export const PollensSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    concentrations: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

PollensSchema.set('toObject', { virtuals: true });
PollensSchema.set('toJSON', { virtuals: true });

export type Pollens = {
  _id: string;
  id: string;
  location: string;
  date: string;
  concentrations: [string];
};

export type PollensDocument = Pollens & Document;
