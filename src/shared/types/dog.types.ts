import { Prisma } from '@prisma/client';

export type SearchDog = {
  name: Prisma.StringFilter<'Dog'>;
};

export type DogOrderFields = 'name' | 'birthAt' | 'createdAt';
