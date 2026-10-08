import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserDocument } from './schema/user.schema';
import { CreateUserDto } from './dto/createUserDto';
import { UserDec } from './decorators/user.decorator';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Pagination } from '../interfaces/pagination.interface';
import { ChangePasswordDto } from './dto/change.password.dto';
import { ResetPasswordDto } from './dto/reset.password.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { ConfirmEmailDTO } from './dto/confirm.email.dto';
import { RefreshTokenDTO } from './dto/refresh.tokens.dto';
import { UpdateLocationDto } from './dto/update.location.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiQuery({ name: 'perPage', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'dateSort', required: false })
  @ApiQuery({ name: 'nameSort', required: false })
  async getAllUsers(
    @Query('perPage') perPage: number,
    @Query('page') page: number,
    @Query('dateSort') dateSort: 1 | -1,
    @Query('nameSort') nameSort: 1 | -1,
  ): Promise<Pagination<User>> {
    return await this.userService.findAll(perPage, page, dateSort, nameSort);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@UserDec() user: UserDocument) {
    return user;
  }

  @Post()
  async registerUser(@Body() user: CreateUserDto): Promise<UserDocument> {
    const client: User = {
      username: user.username,
      date_of_birth: user.date_of_birth,
      email: user.email,
      password: user.password,
      isValidated: false,
    };
    return await this.userService.create(client);
  }

  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @Post('/login')
  async login(@UserDec() user: UserDocument): Promise<object> {
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/location')
  async updateLocation(
    @Body() updateLocationDTO: UpdateLocationDto,
    @UserDec() user: UserDocument,
  ) {
    await this.userService.updateLocation(updateLocationDTO, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateUser(
    @UserDec() user: UserDocument,
    @Body() body: any,
  ): Promise<UserDocument> {
    return await this.userService.updateUser(user, body);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('/logout')
  @ApiBody({ type: String, description: 'Add refresh token' })
  async logout(
    @Body('token') token: string,
    @UserDec() user: UserDocument,
  ): Promise<UserDocument> {
    return this.authService.logout(user, token);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/logoutAll')
  async logoutAll(@UserDec() user: UserDocument): Promise<any> {
    return this.authService.logoutAll(user);
  }

  @Get('/refresh')
  @ApiBody({ type: RefreshTokenDTO })
  async refreshTokens(@Body() rfDTO: RefreshTokenDTO): Promise<object> {
    return this.authService.refreshTokens(rfDTO.id, rfDTO.refreshToken);
  }

  @Get('/confirm-email')
  @ApiBody({ type: ConfirmEmailDTO })
  async confirmEmail(
    @Body() confirmEmailDTO: ConfirmEmailDTO,
  ): Promise<string> {
    return this.userService.confirmEmail(
      confirmEmailDTO.code,
      confirmEmailDTO.id,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/resend-email')
  async resendEmail(@UserDec() user: UserDocument): Promise<string> {
    return this.userService.resendConfEmail(user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/changePassword')
  @ApiBody({ type: ChangePasswordDto })
  @UsePipes(new ValidationPipe())
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @UserDec() user: UserDocument,
  ): Promise<UserDocument> {
    return await this.userService.changePassword(
      user,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }

  @Post('reset-password/')
  @ApiBody({ type: ResetPasswordDto })
  async confirmReset(@Body() body: ResetPasswordDto): Promise<string> {
    return await this.userService.confirmReset(body.code, body.newPassword);
  }

  @Get('reset/:email')
  @ApiParam({ name: 'email' })
  async resetPassword(@Param('email') email: string): Promise<string> {
    return await this.userService.resetPassword(email);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('/me')
  async deleteMe(@UserDec() user: User) {
    return this.userService.delete(user);
  }
}
