import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ConcentrationsService } from './concentration.service';
import { Concentrations } from './schema/concentration.schema';

@ApiTags('Concentrations')
@Controller('concentrations')
export class ConcentrationsController {
  constructor(private readonly concentrationsService: ConcentrationsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getConcentrations(): Promise<Concentrations[]> {
    return await this.concentrationsService.findAll();
  }

  @Get(':id')
  async getConcentration(@Param('id') id: string) {
    return await this.concentrationsService.findById(id);
  }

  @Post()
  async seedConcentrations(): Promise<string> {
    return await this.concentrationsService.seed();
  }
}
