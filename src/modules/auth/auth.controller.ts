import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { AuthRequest } from './models/AuthRequest';
import { IsPublic } from '../../decorators/is-public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ActivateAccountDto } from './dto/activate-account.dto';
import { ResendActivationEmailDto } from './dto/resend-activation-email.dto';
import { AcceptTermsDto } from './dto/accept-terms.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@IsPublic()
@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: AuthRequest, @Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  register(@Req() req: AuthRequest, @Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto, req);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('activate')
  async activateAccount(
    @Query('token') token: string,
    @Req() req: AuthRequest,
  ) {
    if (!token) {
      throw new BadRequestException('Token is required');
    }
    const activateAccountDto = new ActivateAccountDto();
    activateAccountDto.token = token;
    await this.authService.activateAccount(activateAccountDto, req);
    return { message: 'Account activated successfully' };
  }

  @Post('resend-activation')
  @HttpCode(HttpStatus.OK)
  async resendActivation(
    @Body() resendActivationDto: ResendActivationEmailDto,
  ) {
    return this.authService.resendActivationEmail(resendActivationDto);
  }

  @Post('accept-terms')
  @HttpCode(HttpStatus.OK)
  async acceptTerms(
    @Req() req: AuthRequest,
    @Body() acceptTermsDto: AcceptTermsDto,
  ) {
    return this.authService.acceptTerms(req.user.id, acceptTermsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: AuthRequest): Promise<{ message: string }> {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];
    console.log('Token JWT:', token);
    console.log('User:', req.user);

    if (!req.user) {
      throw new UnauthorizedException('User not found');
    }

    const userId = req.user.id;
    await this.authService.logout(userId);
    return { message: 'Saindo do sistema' };
  }
}
