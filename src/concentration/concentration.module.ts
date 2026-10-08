import { ConfigService } from '@nestjs/config';
import { ConcentrationsService } from './concentration.service';
import { ConcentrationsRepository } from './concentration.repository';
import { ConcentrationsController } from './concentration.controller';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { ConcentrationsSchema } from './schema/concentration.schema';
import { PollensModule } from 'src/pollens/pollens.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Concentrations', schema: ConcentrationsSchema },
    ]),
    HttpModule,
    PollensModule,
  ],
  providers: [ConcentrationsService, ConcentrationsRepository, ConfigService],
  controllers: [ConcentrationsController],
  exports: [ConcentrationsService],
})
export class ConcentrationsModule {}
