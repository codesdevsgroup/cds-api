import { Partner, Prisma, User } from '@prisma/client';

export type SearchPartner = {
  name: Prisma.StringFilter<'Partner'>;
};

export type PartnerOrderFields = 'name' | 'email' | 'createdAt';

export interface ConnectOrDisconnectUser extends Partner {
  user: User[];
}
