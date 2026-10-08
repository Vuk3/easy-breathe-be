import { Schema, Document } from 'mongoose';

export const AllergensSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    localized_name: {
      type: String,
      required: true,
    },
    margine_top: { type: String, required: true },
    margine_bottom: { type: String, required: true },
    type: { type: String, required: true },
    allergenicity: { type: String, required: true },
    allergenicity_display: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

AllergensSchema.set('toObject', { virtuals: true });
AllergensSchema.set('toJSON', { virtuals: true });

export type Allergens = {
  _id: string;
  id: string;
  name: string;
  localized_name: string;
  margine_top: string;
  margine_bottom: string;
  type: string;
  allergenicity: string;
  allergenicity_display: string;
};

export type AllergensDocument = Allergens & Document;
