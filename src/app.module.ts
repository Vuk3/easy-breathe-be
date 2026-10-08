import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { EmailsModule } from './emails/emails.module';
import { ConfigModule } from '@nestjs/config';
import { AllergenTypeModule } from './allergenTypes/allergenTypes.module';
import { AllergensModule } from './allergens/allergens.module';
import { LocationsModule } from './locations/locations.module';
import { PollensModule } from './pollens/pollens.module';
import { ConcentrationsModule } from './concentration/concentration.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    UserModule,
    DatabaseModule,
    EmailsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AllergenTypeModule,
    AllergensModule,
    LocationsModule,
    PollensModule,
    ConcentrationsModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
