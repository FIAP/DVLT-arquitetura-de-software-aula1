import { UserRepository } from '../../domain/repositories/UserRepository';
import { GetUserPort, GetUserResponse } from '../ports/UserUseCasesPorts';

export class GetUserUseCase implements GetUserPort {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<GetUserResponse | null> {
    const user = await this.userRepository.findById(id);
    
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };
  }
} 