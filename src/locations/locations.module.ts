import { ConfigService } from '@nestjs/config';
import { LocationsService } from './locations.service';
import { LocationsRepository } from './locations.repository';
import { LocationsController } from './locations.controller';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationsSchema } from './schema/locations.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Locations', schema: LocationsSchema }]),
    HttpModule,
  ],
  providers: [LocationsService, LocationsRepository, ConfigService],
  controllers: [LocationsController],
  exports: [LocationsService],
})
export class LocationsModule {}
