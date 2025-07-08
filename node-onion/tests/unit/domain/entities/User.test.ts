// Teste unitário para a entidade User
// Demonstra como testar a camada Domain

import { User } from '../../../../src/domain/entities/User';

describe('User Entity', () => {
  const mockUser = new User(
    '123',
    'João Silva',
    'joao@email.com',
    'hashedPassword',
    new Date('2023-01-01'),
    new Date('2023-01-01')
  );

  describe('isValidEmail', () => {
    it('should return true for valid email', () => {
      expect(mockUser.isValidEmail()).toBe(true);
    });

    it('should return false for invalid email', () => {
      const invalidUser = new User(
        '123',
        'João Silva',
        'email-invalido',
        'hashedPassword',
        new Date('2023-01-01'),
        new Date('2023-01-01')
      );
      expect(invalidUser.isValidEmail()).toBe(false);
    });
  });

  describe('isValidName', () => {
    it('should return true for valid name', () => {
      expect(mockUser.isValidName()).toBe(true);
    });

    it('should return false for short name', () => {
      const shortNameUser = new User(
        '123',
        'J',
        'joao@email.com',
        'hashedPassword',
        new Date('2023-01-01'),
        new Date('2023-01-01')
      );
      expect(shortNameUser.isValidName()).toBe(false);
    });

    it('should return false for long name', () => {
      const longName = 'a'.repeat(101);
      const longNameUser = new User(
        '123',
        longName,
        'joao@email.com',
        'hashedPassword',
        new Date('2023-01-01'),
        new Date('2023-01-01')
      );
      expect(longNameUser.isValidName()).toBe(false);
    });
  });

  describe('updateProfile', () => {
    it('should update name and updatedAt', () => {
      const updatedUser = mockUser.updateProfile('João Santos');
      
      expect(updatedUser.name).toBe('João Santos');
      expect(updatedUser.id).toBe(mockUser.id);
      expect(updatedUser.email).toBe(mockUser.email);
      expect(updatedUser.password).toBe(mockUser.password);
      expect(updatedUser.createdAt).toEqual(mockUser.createdAt);
      expect(updatedUser.updatedAt).not.toEqual(mockUser.updatedAt);
    });

    it('should keep same name if not provided', () => {
      const updatedUser = mockUser.updateProfile();
      
      expect(updatedUser.name).toBe(mockUser.name);
      expect(updatedUser.updatedAt).not.toEqual(mockUser.updatedAt);
    });
  });
}); 