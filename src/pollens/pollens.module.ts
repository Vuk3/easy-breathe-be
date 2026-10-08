import { ConfigService } from '@nestjs/config';
import { PollensService } from './pollens.service';
import { PollensRepository } from './pollens.repository';
import { PollensController } from './pollens.controller';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { PollensSchema } from './schema/pollens.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Pollens', schema: PollensSchema }]),
    HttpModule,
  ],
  providers: [PollensService, PollensRepository, ConfigService],
  controllers: [PollensController],
  exports: [PollensService],
})
export class PollensModule {}
