import { User } from '../../../shared/entities/user.entity';

export interface UserToken {
  access_token: string;
  user: Omit<User, 'password'>;
}
