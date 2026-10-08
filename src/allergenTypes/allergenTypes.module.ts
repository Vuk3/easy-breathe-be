import { ConfigService } from '@nestjs/config';
import { AllergenTypesService } from './allergenTypes.service';
import { AllergenTypeRepository } from './allergenTypes.repository';
import { AllergenTypesController } from './allergenTypes.controller';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { AllergenTypesSchema } from './schema/allergenTypes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'AllergenTypes', schema: AllergenTypesSchema },
    ]),
    HttpModule,
  ],
  providers: [AllergenTypesService, AllergenTypeRepository, ConfigService],
  controllers: [AllergenTypesController],
  exports: [AllergenTypesService],
})
export class AllergenTypeModule {}
