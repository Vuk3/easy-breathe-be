import { Schema, Document } from 'mongoose';

export const LocationsSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    location: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    latitude: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

LocationsSchema.set('toObject', { virtuals: true });
LocationsSchema.set('toJSON', { virtuals: true });

export type Locations = {
  _id: string;
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  description?: string;
  location: {
    type: string;
    coordinates: [number];
  };
};

export type LocationsDocument = Locations & Document;
