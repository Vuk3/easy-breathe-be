import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AllergensService } from './allergens.service';
import { Allergens } from './schema/allergens.schema';

@ApiTags('Allergens')
@Controller('allergens')
export class AllergensController {
  constructor(private readonly allergensService: AllergensService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllAllergenTypes(): Promise<Allergens[]> {
    return await this.allergensService.findAll();
  }

  @Get(':id')
  async getAllergenType(@Param('id') id: string) {
    return await this.allergensService.findById(id);
  }

  @Post()
  async seedAllergenTypes(): Promise<string> {
    return await this.allergensService.seed();
  }
}
