// Camada Application - Interfaces
// Define contratos para serviços externos

export interface IPasswordHasher {
  hash(password: string): Promise<string>;
  compare(password: string, hashedPassword: string): Promise<boolean>;
} 