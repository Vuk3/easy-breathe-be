import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AllergenTypeRepository } from './allergenTypes.repository';
import { AllergenTypesDocument } from './schema/allergenTypes.schema';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AllergenTypesService {
  constructor(
    private allergenTypeRepository: AllergenTypeRepository,
    private readonly httpService: HttpService,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {}

  async seed(): Promise<string> {
    const allergenTypes = await this.fetchData();
    if (!allergenTypes) {
      throw new NotFoundException('Allergen Types not found');
    }
    const dbAllergenTypes = allergenTypes.map((item) => {
      return {
        id: `${item.id}`,
        name: item.name,
      };
    });
    return this.allergenTypeRepository.seedDocuments(dbAllergenTypes);
  }

  async findAll(): Promise<AllergenTypesDocument[]> {
    return await this.allergenTypeRepository.findAll();
  }

  async findById(id: string): Promise<AllergenTypesDocument> {
    return await this.allergenTypeRepository.findById(id);
  }

  private async fetchData(): Promise<any> {
    const response = this.httpService
      .get(`${this.configService.get<string>('OPEN_API_URL')}/allergen-types`)
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
    console.log('Seeder called for alergen types on ', new Date());
  }
}
