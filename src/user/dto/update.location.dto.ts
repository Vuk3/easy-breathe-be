import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateLocationDto {
  @IsNotEmpty()
  @ApiProperty()
  latitude: string;
  @IsNotEmpty()
  @ApiProperty()
  longitude: string;
}
