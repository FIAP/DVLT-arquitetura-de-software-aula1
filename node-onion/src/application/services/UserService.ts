// Camada Application - Serviços de Aplicação
// Contém os casos de uso e regras de negócio da aplicação

import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { Email } from '../../domain/value-objects/Email';
import { IPasswordHasher } from '../interfaces/IPasswordHasher';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/UserDTOs';

export class UserService {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher
  ) {}

  async createUser(userData: CreateUserDTO): Promise<User> {
    // Validar se o email já existe
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    // Validar email
    const email = new Email(userData.email);
    
    // Hash da senha
    const hashedPassword = await this.passwordHasher.hash(userData.password);
    
    // Criar usuário (o ID será gerado pelo MongoDB)
    const user = new User(
      '', // ID temporário, será substituído pelo MongoDB
      userData.name,
      email.getValue(),
      hashedPassword,
      new Date(),
      new Date()
    );

    // Validar regras de negócio
    if (!user.isValidName()) {
      throw new Error('Nome deve ter entre 2 e 100 caracteres');
    }

    return await this.userRepository.save(user);
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async updateUser(id: string, userData: UpdateUserDTO): Promise<User | null> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('Usuário não encontrado');
    }

    // Se está alterando o email, verificar se já existe
    if (userData.email && userData.email !== existingUser.email) {
      const emailExists = await this.userRepository.findByEmail(userData.email);
      if (emailExists) {
        throw new Error('Email já está em uso');
      }
      // Validar novo email
      new Email(userData.email);
    }

    return await this.userRepository.update(id, userData);
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return await this.userRepository.delete(id);
  }

  // Removido generateId() - O MongoDB irá gerar o ID automaticamente
} 