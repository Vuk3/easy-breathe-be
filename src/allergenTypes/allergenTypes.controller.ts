import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AllergenTypesService } from './allergenTypes.service';
import { AllergenType } from './schema/allergenTypes.schema';

@ApiTags('AllergenType')
@Controller('allergenTypes')
export class AllergenTypesController {
  constructor(private readonly allergenTypesService: AllergenTypesService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllAllergenTypes(): Promise<AllergenType[]> {
    return await this.allergenTypesService.findAll();
  }

  @Get(':id')
  async getAllergenType(@Param('id') id: string) {
    return await this.allergenTypesService.findById(id);
  }

  @Post()
  async seedAllergenTypes(): Promise<string> {
    return await this.allergenTypesService.seed();
  }
}
