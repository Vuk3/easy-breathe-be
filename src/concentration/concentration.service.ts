import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConcentrationsRepository } from './concentration.repository';
import { ConcentrationsDocument } from './schema/concentration.schema';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { PollensService } from 'src/pollens/pollens.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ConcentrationsService {
  constructor(
    private concentrationRepository: ConcentrationsRepository,
    private readonly httpService: HttpService,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    private readonly pollenService: PollensService,
  ) {}

  async seed(): Promise<string> {
    const concentrations = await this.fetchData();
    if (!concentrations) {
      throw new NotFoundException('Concentration Types not found');
    }

    const dbConcentrationTypes = concentrations.map((item) => {
      return {
        id: `${item.id}`,
        allergen: `${item.allergen}`,
        value: `${item.value}`,
        pollen: `${item.pollen}`,
      };
    });
    return await this.concentrationRepository.seedDocuments(
      dbConcentrationTypes,
    );
  }

  async findAll(): Promise<ConcentrationsDocument[]> {
    return await this.concentrationRepository.findAll();
  }

  async findById(id: string): Promise<ConcentrationsDocument> {
    return await this.concentrationRepository.findById(id);
  }

  private async fetchData(): Promise<any> {
    const date = await this.getDate();
    const pollens = await this.pollenService.findQuery({
      date: { $gte: date },
    });
    const results = [];
    let finalResult;
    let page = 1;
    let url = `${this.configService.get<string>('OPEN_API_URL')}/concentrations/`;
    pollens.forEach((polen, index) => {
      if (index === 0) {
        url = url.concat('?pollen_ids=', `${polen.id}`);
      } else {
        url = url.concat('&pollen_ids=', `${polen.id}`);
      }
    });
    try {
      do {
        const response = this.httpService
          .get(`${url}${page > 1 ? `&page=${page}` : ''}`)
          .pipe(
            map((response: AxiosResponse) => {
              return response.data;
            }),
          );
        finalResult = await lastValueFrom(response);
        if (finalResult.results.length > 0) {
          finalResult.results.forEach((element) => {
            results.push(element);
          });
        }
        page += 1;
      } while (finalResult.results.length > 0);
    } catch (e) {}
    return results;
  }

  private async getDate(): Promise<string> {
    const today = new Date();
    const previousMonthDate = new Date(today.setDate(today.getDate() - 7));

    const day = previousMonthDate.getDate();
    const month = previousMonthDate.getMonth() + 1;
    const year = previousMonthDate.getFullYear();

    return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
  }

  async findMany(ids: string[]): Promise<ConcentrationsDocument[]> {
    return await this.concentrationRepository.findMany(ids);
  }

  @Cron('0 9-12 * * *')
  handleCron() {
    this.seed().catch((error) => {
      console.log(error);
    });
    console.log('Seeder called for concentrations on ', new Date());
  }
}
