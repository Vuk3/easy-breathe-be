import { ConfigService } from '@nestjs/config';
import { AllergensService } from './allergens.service';
import { AllergensRepository } from './allergens.repository';
import { AllergensController } from './allergens.controller';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { AllergensSchema } from './schema/allergens.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Allergens', schema: AllergensSchema }]),
    HttpModule,
  ],
  providers: [AllergensService, AllergensRepository, ConfigService],
  controllers: [AllergensController],
  exports: [AllergensService],
})
export class AllergensModule {}
