import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { PrismaService } from '../../services/prisma/prisma.service';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async create(createClientDto: CreateClientDto) {
    const { email, phone, address, city, state, zip, country, notes } =
      createClientDto;
    return this.prisma.client.create({
      data: {
        email,
        phone1: phone,
        address: {
          create: {
            street: address,
            city,
            state,
            zipCode: zip,
            country,
          },
        },
        notes,
      },
    });
  }

  findAll() {
    return `This action returns all client`;
  }

  findOne(id: number) {
    return `This action returns a #${id} client`;
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}