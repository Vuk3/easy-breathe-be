import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LocationsService } from './locations.service';
import { Locations } from './schema/locations.schema';

@ApiTags('Locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getLocations(): Promise<Locations[]> {
    return await this.locationsService.findAll();
  }

  @Get(':id')
  async getLocation(@Param('id') id: string) {
    return await this.locationsService.findById(id);
  }

  @Post()
  async seedLocations(): Promise<string> {
    return await this.locationsService.seed();
  }
}
