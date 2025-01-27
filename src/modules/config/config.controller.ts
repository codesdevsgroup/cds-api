import { Controller, Get, Res, Body, Patch, HttpStatus } from '@nestjs/common';
import { ConfigService } from './config.service';
import { Response } from 'express';
import { UpdateConfigDto } from './dto/update-config.dto';
import { CustomInternalErrorException } from '../../exceptions/custom-internal-error.exception';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Config')
@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @ApiBearerAuth()
  @Get()
  async findOne(@Res() res: Response) {
    try {
      const output = await this.configService.findConfig();

      return res.status(HttpStatus.OK).json({
        success: true,
        output,
      });
    } catch (error) {
      throw new CustomInternalErrorException(error);
    }
  }

  @ApiBearerAuth()
  @Patch()
  async update(@Body() updateConfigDto: UpdateConfigDto, @Res() res: Response) {
    try {
      const output = await this.configService.update(updateConfigDto);

      return res.status(HttpStatus.OK).json({
        success: true,
        output,
      });
    } catch (error) {
      throw new CustomInternalErrorException(error);
    }
  }
}
