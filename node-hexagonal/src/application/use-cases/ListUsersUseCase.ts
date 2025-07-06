import { UserRepository } from '../../domain/repositories/UserRepository';
import { ListUsersPort, ListUsersResponse } from '../ports/UserUseCasesPorts';

export class ListUsersUseCase implements ListUsersPort {
  constructor(private readonly userRepository: UserRepository) {}

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