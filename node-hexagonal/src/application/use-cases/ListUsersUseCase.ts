import { UserRepository } from '../../domain/repositories/UserRepository';

export interface ListUsersResponse {
  users: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
  }[];
}

export class ListUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<ListUsersResponse> {
    const users = await this.userRepository.findAll();
    
    return {
      users: users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }))
    };
  }
} 