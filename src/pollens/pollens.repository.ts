import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Pollens, PollensDocument } from './schema/pollens.schema';

@Injectable()
export class PollensRepository {
  constructor(
    @InjectModel('Pollens')
    private PollenModel: mongoose.Model<Pollens>,
  ) {}

  async create(Pollen: Pollens): Promise<PollensDocument> {
    return this.PollenModel.create(Pollen);
  }

  async findAll(): Promise<PollensDocument[]> {
    return await this.PollenModel.find();
  }

  async findQuery(query: any): Promise<PollensDocument[]> {
    return await this.PollenModel.find(query);
  }

  async findById(id: string): Promise<PollensDocument> {
    return await this.PollenModel.findOne({ id });
  }

  async seedDocuments(documents: Pollens[]): Promise<string> {
    const existingDocuments = await this.PollenModel.find({
      id: { $in: documents.map((doc) => doc.id) },
    }).exec();

    const newDocuments = documents.filter(
      (doc) =>
        !existingDocuments.some((existingDoc) => existingDoc.id === doc.id),
    );
    let created;

    if (newDocuments.length > 0) {
      created = await this.PollenModel.insertMany(newDocuments);
    }
    return `Created ${(created && created.length) > 0 ? created.length : '0'} new pollens`;
  }
}
