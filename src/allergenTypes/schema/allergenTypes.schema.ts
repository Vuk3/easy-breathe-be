import { Schema, Document } from 'mongoose';

export const AllergenTypesSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

AllergenTypesSchema.set('toObject', { virtuals: true });
AllergenTypesSchema.set('toJSON', { virtuals: true });

export type AllergenType = {
  _id: string;
  id: string;
  name: string;
};

export type AllergenTypesDocument = AllergenType & Document;
