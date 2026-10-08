import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSchema } from './schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { refreshTokenSchema } from './schema/refreshToken.schema';
import { confirmationTokenSchema } from './schema/confirmation.tokens.schema';
import { AuthModule } from '../auth/auth.module';
import { EmailsModule } from '../emails/emails.module';
import { ConfigService } from '@nestjs/config';
import { LocationsModule } from 'src/locations/locations.module';
import { PollensModule } from 'src/pollens/pollens.module';
import { ConcentrationsModule } from 'src/concentration/concentration.module';

@Module({
  imports: [
    EmailsModule,
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Token', schema: refreshTokenSchema }]),
    MongooseModule.forFeature([
      { name: 'ConfirmationToken', schema: confirmationTokenSchema },
    ]),
    LocationsModule,
    PollensModule,
    ConcentrationsModule,
  ],
  providers: [UserService, UserRepository, JwtService, ConfigService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
