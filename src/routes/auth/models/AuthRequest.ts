import { Request } from 'express';
import { User } from '../../../shared/entities/user.entity';

export interface AuthRequest extends Request {
  user: User;
}
