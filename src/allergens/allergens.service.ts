import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AllergensRepository } from './allergens.repository';
import { AllergensDocument } from './schema/allergens.schema';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AllergensService {
  constructor(
    private allergenTypeRepository: AllergensRepository,
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
        localized_name: item.localized_name,
        margine_top: `${item.margine_top}`,
        margine_bottom: `${item.margine_bottom}`,
        type: `${item.type}`,
        allergenicity: `${item.allergenicity}`,
        allergenicity_display: item.allergenicity_display,
      };
    });
    return await this.allergenTypeRepository.seedDocuments(dbAllergenTypes);
  }

  async findAll(): Promise<AllergensDocument[]> {
    return await this.allergenTypeRepository.findAll();
  }

  async findById(id: string): Promise<AllergensDocument> {
    return await this.allergenTypeRepository.findById(id);
  }

  private async fetchData(): Promise<any> {
    const response = this.httpService
      .get(`${this.configService.get<string>('OPEN_API_URL')}/allergens`)
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
