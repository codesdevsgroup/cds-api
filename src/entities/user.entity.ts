import { Role } from '@prisma/client';

export class User {
  id: string;
  email: string;
  username: string;
  cpfCnpj?: string;
  password: string;
  partnerId?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  isActive: boolean;
  activatedAt?: Date;
  termsIp?: string;
  termsAccepted: boolean;
  role: Role;
  personId?: number;
  kennelId?: number;
  tokenVersion: number;
}
