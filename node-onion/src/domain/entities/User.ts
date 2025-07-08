// Camada Domain - Entidades
// Esta é a camada mais interna da arquitetura Onion
// Contém as regras de negócio fundamentais

export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  // Métodos de negócio
  public isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  public isValidName(): boolean {
    return this.name.length >= 2 && this.name.length <= 100;
  }

  public updateProfile(name?: string): User {
    return new User(
      this.id,
      name || this.name,
      this.email,
      this.password,
      this.createdAt,
      new Date()
    );
  }
} 