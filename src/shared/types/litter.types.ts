import { Dog, Litter, Prisma } from '@prisma/client';

export type SearchLitter = {
  description: Prisma.StringNullableFilter<'Litter'>;
};

export type LitterOrderFields = 'description';

export interface ConnectOrDisconnectDog extends Litter {
  dog: Dog[];
}
