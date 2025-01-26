import { Injectable } from '@nestjs/common';
import { UpdateConfigDto } from './dto/update-config.dto';
import { PrismaService } from '../../services/prisma/prisma.service';

@Injectable()
export class ConfigService {
  constructor(private prisma: PrismaService) {}

  findConfig() {
    return this.prisma.config.findFirst();
  }

  async update(data: UpdateConfigDto) {
    const config = await this.prisma.config.findFirst();

    return this.prisma.config.update({ where: { id: config.id }, data });
  }
}
