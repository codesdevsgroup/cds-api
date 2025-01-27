export class User {
  id: string;
  email: string;
  username: string;
  cpfCnpj?: string;
  password: string;
  createdAt: Date;
  tokenVersion: number;
}
