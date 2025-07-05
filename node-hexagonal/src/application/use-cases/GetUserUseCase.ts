import { UserRepository } from '../../domain/repositories/UserRepository';

export interface GetUserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export class GetUserUseCase {
  constructor(private userRepository: UserRepository) {}

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