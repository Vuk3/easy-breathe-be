import { Schema, Document } from 'mongoose';

export const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    date_of_birth: {
      type: Date,
      required: true,
    },
    resetCode: {
      type: String,
    },
    password: {
      type: String,
      minlength: 7,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    profilePicture: {
      type: String,
      required: false,
    },
    isValidated: {
      type: Boolean,
      required: true,
    },
    allergens: {
      type: [{ id: String, item: String }],
    },
    notificationFrequency: {
      type: String,
      default: '1',
    },
    radius: {
      type: String,
      default: '50',
    },
    longitude: {
      type: Number,
    },
    latitude: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.virtual('tokens', {
  ref: 'Tokens',
  localField: '_id',
  foreignField: 'userId',
});

UserSchema.index({ refreshTokens: 1 });

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

export type User = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  username: string;
  date_of_birth: Date;
  resetCode?: string;
  password: string;
  email: string;
  profilePicture?: string;
  isValidated: boolean;
  allergens?: [{ id: string; item: string }];
  notificationFrequency?: string;
  radius?: string;
  latitude?: number;
  longitude?: number;
};

export type UserDocument = User & Document;
