import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Allergens, AllergensDocument } from './schema/allergens.schema';

@Injectable()
export class AllergensRepository {
  constructor(
    @InjectModel('Allergens')
    private allergenModel: mongoose.Model<Allergens>,
  ) {}

  async create(allergenType: Allergens): Promise<AllergensDocument> {
    return this.allergenModel.create(allergenType);
  }

  async findAll(): Promise<AllergensDocument[]> {
    return await this.allergenModel.find();
  }

  async findById(id: string): Promise<AllergensDocument> {
    return await this.allergenModel.findOne({ id });
  }

  async seedDocuments(documents: Allergens[]): Promise<string> {
    const existingDocuments = await this.allergenModel
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
      created = await this.allergenModel.insertMany(newDocuments);
    }
    return `Created ${(created && created.length) > 0 ? created.length : '0'} new allergens`;
  }
}
