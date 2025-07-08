// Camada Infrastructure - Implementação do Repositório
// Implementação concreta do repositório usando MongoDB

import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { UserModel, IUserDocument } from '../database/mongoose/UserModel';

export class MongoUserRepository implements IUserRepository {
  
  async save(user: User): Promise<User> {
    const userDoc = new UserModel({
      name: user.name,
      email: user.email,
      password: user.password
    });

    const savedUser = await userDoc.save();
    return this.toDomainEntity(savedUser);
  }

  async findById(id: string): Promise<User | null> {
    const userDoc = await UserModel.findById(id);
    return userDoc ? this.toDomainEntity(userDoc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ email: email.toLowerCase() });
    return userDoc ? this.toDomainEntity(userDoc) : null;
  }

  async findAll(): Promise<User[]> {
    const userDocs = await UserModel.find().sort({ createdAt: -1 });
    return userDocs.map(doc => this.toDomainEntity(doc));
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const userDoc = await UserModel.findByIdAndUpdate(
      id,
      userData,
      { new: true }
    );
    return userDoc ? this.toDomainEntity(userDoc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return result !== null;
  }

  private toDomainEntity(userDoc: IUserDocument): User {
    return new User(
      userDoc._id.toString(),
      userDoc.name,
      userDoc.email,
      userDoc.password,
      userDoc.createdAt,
      userDoc.updatedAt
    );
  }
} 