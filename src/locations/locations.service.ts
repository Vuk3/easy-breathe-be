import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LocationsRepository } from './locations.repository';
import { LocationsDocument } from './schema/locations.schema';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class LocationsService {
  constructor(
    private locationRepository: LocationsRepository,
    private readonly httpService: HttpService,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {}

  async seed(): Promise<string> {
    const locations = await this.fetchData();
    if (!locations) {
      throw new NotFoundException('Location Types not found');
    }
    const dbLocationTypes = locations.map((item) => {
      return {
        id: `${item.id}`,
        name: item.name,
        location: {
          type: 'Point',
          coordinates: [parseFloat(item.longitude), parseFloat(item.latitude)],
        },
        latitude: `${item.latitude}`,
        longitude: `${item.longitude}`,
        description: item.description,
      };
    });
    return await this.locationRepository.seedDocuments(dbLocationTypes);
  }

  async findAll(): Promise<LocationsDocument[]> {
    return await this.locationRepository.findAll();
  }

  async findWithinRadius(
    lng: number,
    lat: number,
    radius: number,
  ): Promise<LocationsDocument[]> {
    return await this.locationRepository.findWithinRadius(lng, lat, radius);
  }

  async findById(id: string): Promise<LocationsDocument> {
    return await this.locationRepository.findById(id);
  }

  private async fetchData(): Promise<any> {
    const response = this.httpService
      .get(`${this.configService.get<string>('OPEN_API_URL')}/locations`)
      .pipe(
        map((response: AxiosResponse) => {
          return response.data;
        }),
      );
    return await lastValueFrom(response);
  }

  @Cron('0 9 1 * *')
  handleCron() {
    this.seed().catch((error) => {
      console.log(error);
    });
    console.log('Seeder called for alergens on ', new Date());
  }
}
