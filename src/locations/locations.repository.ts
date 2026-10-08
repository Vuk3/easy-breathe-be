import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Locations, LocationsDocument } from './schema/locations.schema';

@Injectable()
export class LocationsRepository {
  constructor(
    @InjectModel('Locations')
    private LocationModel: mongoose.Model<Locations>,
  ) {}

  async create(Location: Locations): Promise<LocationsDocument> {
    return this.LocationModel.create(Location);
  }

  async findAll(): Promise<LocationsDocument[]> {
    return await this.LocationModel.find();
  }

  async findById(id: string): Promise<LocationsDocument> {
    return await this.LocationModel.findOne({ id });
  }

  async seedDocuments(documents: Locations[]): Promise<string> {
    const existingDocuments = await this.LocationModel.find({
      id: { $in: documents.map((doc) => doc.id) },
    }).exec();

    const newDocuments = documents.filter(
      (doc) =>
        !existingDocuments.some((existingDoc) => existingDoc.id === doc.id),
    );
    let created;

    if (newDocuments.length > 0) {
      created = await this.LocationModel.insertMany(newDocuments);
    }
    return `Created ${(created && created.length) > 0 ? created.length : '0'} new locations`;
  }

  async findWithinRadius(
    lng: number,
    lat: number,
    radius: number,
  ): Promise<LocationsDocument[]> {
    const earthRadiusInKm = 6378.1;
    return await this.LocationModel.find({
      location: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radius / earthRadiusInKm],
        },
      },
    });
  }
}
