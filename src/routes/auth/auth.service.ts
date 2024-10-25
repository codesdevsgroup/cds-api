import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedError } from './errors/unauthorized.error';
import { User } from '../../shared/entities/user.entity';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/UserToken';
import { RegisterUserDto } from './dto/register-user.dto';
import { PrismaService } from '../../services/prisma/prisma.service';
import { EmailService } from '../../services/email/email.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ValidationUtils } from './utils/validation.utils';
import { TokenUtils } from './utils/token.utils';
import { EmailUtils } from './utils/email.utils';
import { ActivateAccountDto } from './dto/activate-account.dto';
import { AuthRequest } from './models/AuthRequest';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ResendActivationEmailDto } from './dto/resend-activation-email.dto';
import { AcceptTermsDto } from './dto/accept-terms.dto';

@Injectable()
export class AuthService {
  private readonly validationUtils: ValidationUtils;
  private readonly tokenUtils: TokenUtils;
  private readonly emailUtils: EmailUtils;

  constructor(
    @InjectQueue('email') private readonly emailQueue: Queue,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {
    this.validationUtils = new ValidationUtils(this.userService);
    this.tokenUtils = new TokenUtils(this.configService, this.jwtService);
    this.emailUtils = new EmailUtils(
      this.emailService,
      this.configService,
      this.tokenUtils,
    );
  }

  async login(loginAuthDto: LoginAuthDto): Promise<UserToken> {
    const { identifier, password } = loginAuthDto;
    const user = await this.validateUser(identifier, password);

    if (!user.termsAccepted) {
      throw new UnauthorizedException(
        'O usuário não aceitou os termos e condições.',
      );
    }

    const payload = this.createUserPayload(user);
    const accessToken = this.jwtService.sign(payload);

    const { password: _userPassword, ...userWithoutPassword } = user;

    return {
      access_token: accessToken,
      user: userWithoutPassword,
    };
  }

  async validateUser(identifier: string, password: string) {
    const user = await this.userService.findOneByEmailOrUsername(identifier);
    if (user && user.deletedAt === null) {
      if (!user.isActive) {
        await this.emailQueue.add('sendActivationEmail', { user });
        throw new UnauthorizedError(
          'A conta do usuário não está ativada. Um e-mail de ativação foi enviado.',
          401,
        );
      }
      if (await this.isPasswordValid(password, user.password)) {
        return { ...user, password: undefined };
      }
    }
    throw new UnauthorizedError(
      user && user.deletedAt !== null
        ? 'A conta do usuário foi excluída.'
        : 'O endereço de e-mail ou a senha fornecidos estão incorretos.',
      user && user.deletedAt !== null ? 403 : 401,
    );
  }

  async register(registerUserDto: RegisterUserDto, req: AuthRequest) {
    const { email, username, cpfCnpj, password } = registerUserDto;
    const ip = (req.headers['x-forwarded-for'] ||
      req.socket.remoteAddress) as string;

    if (!ip) {
      throw new BadRequestException('O IP é obrigatório');
    }

    await this.validationUtils.validateUniqueEmail(email);
    await this.validationUtils.validateUniqueUsername(username);
    await this.validationUtils.validateUniqueCpfCnpj(cpfCnpj);

    const hashedPassword = await this.hashPassword(password);

    const createdUser = await this.prisma.user.create({
      data: {
        email,
        username,
        cpfCnpj,
        password: hashedPassword,
        termsIp: ip,
        tokenVersion: 0,
      },
    });

    await this.emailQueue.add('sendActivationEmail', { user: createdUser });

    return { ...createdUser, password: undefined };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email not found');
    }

    await this.emailUtils.sendResetPasswordEmail(user);

    return { message: 'E-mail de redefinição de senha enviado' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;
    let payload: any;
    try {
      payload = this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }

    const userId = payload.sub;
    const hashedPassword = await this.hashPassword(newPassword);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Redefinição de senha com sucesso' };
  }

  async resendActivationEmail(
    resendActivationEmailDto: ResendActivationEmailDto,
  ) {
    const { email } = resendActivationEmailDto;
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      return {
        status: 200,
        message:
          'Se o e-mail estiver registrado, um e-mail de ativação foi enviado.',
      };
    }

    if (!user.isActive) {
      await this.emailUtils.sendActivationEmail(user);
    }

    return {
      status: 200,
      message:
        'Se o e-mail estiver cadastrado, um e-mail de ativação foi enviado.',
    };
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async activateAccount(
    activateAccountDto: ActivateAccountDto,
    req: AuthRequest,
  ): Promise<void> {
    const { token } = activateAccountDto;
    const ip = (req.headers['x-forwarded-for'] ||
      req.socket.remoteAddress) as string;

    if (!ip) {
      throw new BadRequestException('IP is required');
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedError('Token inválido ou expirado');
    }

    const userId = payload.sub;

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        isActive: true,
        activatedAt: new Date(),
        termsIp: ip,
        termsAccepted: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('Token inválido');
    }
  }

  async acceptTerms(userId: string, acceptTermsDto: AcceptTermsDto) {
    return this.userService.updateUserTerms(
      userId,
      acceptTermsDto.termsAccepted,
    );
  }

  private createUserPayload(user: User): UserPayload {
    return {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };
  }

  private async isPasswordValid(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async logout(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        tokenVersion: { increment: 1 },
      },
    });
  }
}
