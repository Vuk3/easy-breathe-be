import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import {
  AllergenType,
  AllergenTypesDocument,
} from './schema/allergenTypes.schema';

@Injectable()
export class AllergenTypeRepository {
  constructor(
    @InjectModel('AllergenTypes')
    private allergenTypeModel: mongoose.Model<AllergenType>,
  ) {}

  async create(allergenType: AllergenType): Promise<AllergenTypesDocument> {
    return this.allergenTypeModel.create(allergenType);
  }

  async findAll(): Promise<AllergenTypesDocument[]> {
    return await this.allergenTypeModel.find();
  }

  async findById(id: string): Promise<AllergenTypesDocument> {
    return await this.allergenTypeModel.findOne({ id });
  }

  async seedDocuments(documents: AllergenType[]): Promise<string> {
    const existingDocuments = await this.allergenTypeModel
      .find({
        id: { $in: documents.map((doc) => doc.id) },
      })
      .exec();

    const newDocuments = documents.filter(
      (doc) =>
        !existingDocuments.some((existingDoc) => existingDoc.id === doc.id),
    );
    let created;

    if (newDocuments.length > 0) {
      created = await this.allergenTypeModel.insertMany(newDocuments);
    }
    return `Created ${(created && created.length) > 0 ? created.length : '0'} new allergen types`;
  }
}
