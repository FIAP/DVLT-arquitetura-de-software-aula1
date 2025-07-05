export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly createdAt: Date = new Date()
  ) {}

  public static create(id: string, name: string, email: string): User {
    if (!name || name.trim().length === 0) {
      throw new Error('Nome é obrigatório');
    }
    
    if (!email || !this.isValidEmail(email)) {
      throw new Error('Email inválido');
    }

    return new User(id, name.trim(), email.toLowerCase());
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt
    };
  }
} 