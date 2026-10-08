import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PollensService } from './pollens.service';
import { Pollens } from './schema/pollens.schema';

@ApiTags('Pollens')
@Controller('pollens')
export class PollensController {
  constructor(private readonly pollensService: PollensService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async getPollens(): Promise<Pollens[]> {
    return await this.pollensService.findAll();
  }

  @Get(':id')
  async getPollen(@Param('id') id: string) {
    return await this.pollensService.findById(id);
  }

  @Post()
  async seedPollens(): Promise<string> {
    return await this.pollensService.seed();
  }
}
