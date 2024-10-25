import { Prisma } from '@prisma/client';

export type SearchDogBreed = {
  name: Prisma.StringFilter<'DogBreed'>;
};

export type DogBreedOrderFields = 'name' | 'createdAt';
