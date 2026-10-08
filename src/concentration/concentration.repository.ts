import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import {
  Concentrations,
  ConcentrationsDocument,
} from './schema/concentration.schema';

@Injectable()
export class ConcentrationsRepository {
  constructor(
    @InjectModel('Concentrations')
    private ConcentrationModel: mongoose.Model<Concentrations>,
  ) {}

  async create(Concentration: Concentrations): Promise<ConcentrationsDocument> {
    return this.ConcentrationModel.create(Concentration);
  }

  async findAll(): Promise<ConcentrationsDocument[]> {
    return await this.ConcentrationModel.find();
  }

  async findById(id: string): Promise<ConcentrationsDocument> {
    return await this.ConcentrationModel.findOne({ id });
  }

  async seedDocuments(documents: Concentrations[]): Promise<string> {
    const existingDocuments = await this.ConcentrationModel.find({
      id: { $in: documents.map((doc) => doc.id) },
    }).exec();

    const newDocuments = documents.filter(
      (doc) =>
        !existingDocuments.some((existingDoc) => existingDoc.id === doc.id),
    );
    let created;

    if (newDocuments.length > 0) {
      created = await this.ConcentrationModel.insertMany(newDocuments);
    }
    return `Created ${(created && created.length) > 0 ? created.length : '0'} new concentrations`;
  }

  async findMany(ids: string[]): Promise<ConcentrationsDocument[]> {
    return await this.ConcentrationModel.find({ id: { $in: ids } });
  }
}
