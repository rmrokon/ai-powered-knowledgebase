import { HttpClient } from '../http-client';

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export class UserRepository {
  constructor(private client: HttpClient) {}

  async getUsers(): Promise<IUser[]> {
    return this.client.get<IUser[]>('/users');
  }

  async getUser(id: number): Promise<IUser> {
    return this.client.get<IUser>(`/users/${id}`);
  }
}
