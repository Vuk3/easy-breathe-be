import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PollensRepository } from './pollens.repository';
import { PollensDocument } from './schema/pollens.schema';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PollensService {
  constructor(
    private pollenRepository: PollensRepository,
    private readonly httpService: HttpService,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {}

  async seed(): Promise<string> {
    const pollens = await this.fetchData();
    if (!pollens) {
      throw new NotFoundException('Pollen Types not found');
    }
    const dbPollenTypes = pollens.map((item) => {
      return {
        id: `${item.id}`,
        name: item.name,
        location: `${item.location}`,
        date: item.date,
        concentrations: item.concentrations.map((concentration) => {
          return `${concentration}`;
        }),
      };
    });
    return await this.pollenRepository.seedDocuments(dbPollenTypes);
  }

  async findAll(): Promise<PollensDocument[]> {
    return await this.pollenRepository.findAll();
  }

  async findQuery(query: any): Promise<PollensDocument[]> {
    return await this.pollenRepository.findQuery(query);
  }

  async findById(id: string): Promise<PollensDocument> {
    return await this.pollenRepository.findById(id);
  }

  private async fetchData(): Promise<any> {
    const startDate = await this.getDate();
    const results = [];
    let finalResult;
    let page = 1;
    try {
      do {
        const response = this.httpService
          .get(
            `${this.configService.get<string>('OPEN_API_URL')}/pollens/?date_after=${startDate}${page > 1 ? `&page=${page}` : ''}`,
          )
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
    const previousMonthDate = new Date(today.setMonth(today.getMonth() - 1));

    const day = previousMonthDate.getDate();
    const month = previousMonthDate.getMonth() + 1;
    const year = previousMonthDate.getFullYear();

    return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
  }

  @Cron('0 9-12 * * *')
  handleCron() {
    this.seed().catch((error) => {
      console.log(error);
    });
    console.log('Seeder called for pollens on ', new Date());
  }
}
