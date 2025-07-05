import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async emailExists(email: string): Promise<boolean> {
    const existingUser = await this.userRepository.findByEmail(email);
    return existingUser !== null;
  }

  async validateUniqueEmail(email: string, excludeId?: string): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser && existingUser.id !== excludeId) {
      throw new Error('Email já está em uso');
    }
  }
} 