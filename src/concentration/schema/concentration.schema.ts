import { Schema, Document } from 'mongoose';

export const ConcentrationsSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    allergen: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    pollen: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

ConcentrationsSchema.set('toObject', { virtuals: true });
ConcentrationsSchema.set('toJSON', { virtuals: true });

export type Concentrations = {
  _id: string;
  id: string;
  allergen: string;
  value: string;
  pollen: [string];
};

export type ConcentrationsDocument = Concentrations & Document;
