import { Prisma } from '@prisma/client';

export type SearchKennel = {
  name: Prisma.StringFilter<'Kennel'>;
};

export type KennelOrderFields = 'name' | 'createdAt';
