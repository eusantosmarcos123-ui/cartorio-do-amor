import { sqlDb } from './sqlDatabase';
import type { User } from '../types/auth';
import { hashPassword, verifyPassword } from '../utils/cryptoUtils';

export class SqlAuthService {
  /**
   * Realiza login no banco SQL executando SELECT parametrizado e verificação de Hash
   */
  public static async login(email: string, password: string): Promise<User> {
    const normalizedEmail = email.trim().toLowerCase();

    // SQL Query: SELECT * FROM users WHERE LOWER(email) = ?
    const userRecord = await sqlDb.selectUserByEmail(normalizedEmail);

    if (!userRecord) {
      throw new Error('E-mail ou senha estão incorretos.');
    }

    const isValidPassword = await verifyPassword(password, userRecord.password_hash);

    if (!isValidPassword) {
      throw new Error('E-mail ou senha estão incorretos.');
    }

    // Auto-upgrade to SHA-256 hash if user had a legacy unhashed password
    if (!userRecord.password_hash.startsWith('$sha256$')) {
      const secureHash = await hashPassword(password);
      await sqlDb.updateUserPasswordHash(userRecord.id, secureHash);
    }

    const authenticatedUser: User = {
      id: userRecord.id,
      name: userRecord.name,
      email: userRecord.email,
      partnerName: userRecord.partner_name,
      savedCertificatesCount: userRecord.saved_certificates_count || 1,
    };

    return authenticatedUser;
  }

  /**
   * Realiza cadastro no banco SQL gerando Hash Criptográfico SHA-256 da senha
   */
  public static async register(params: {
    name: string;
    email: string;
    password: string;
    partnerName?: string;
  }): Promise<User> {
    const normalizedEmail = params.email.trim().toLowerCase();

    // Check if user already exists: SELECT count(*) FROM users WHERE email = ?
    const existing = await sqlDb.selectUserByEmail(normalizedEmail);
    if (existing) {
      throw new Error('Já existe uma conta registrada com este e-mail no banco SQL. Faça login na aba "Entrar"!');
    }

    // Cryptographic Password Hashing (Never store plain text password!)
    const securePasswordHash = await hashPassword(params.password);

    // SQL Query: INSERT INTO users (name, email, password_hash, ...) VALUES (...)
    const insertedRecord = await sqlDb.insertUser({
      name: params.name.trim(),
      email: normalizedEmail,
      passwordHash: securePasswordHash,
      partnerName: params.partnerName?.trim() || undefined,
    });

    const newUser: User = {
      id: insertedRecord.id,
      name: insertedRecord.name,
      email: insertedRecord.email,
      partnerName: insertedRecord.partner_name,
      savedCertificatesCount: 0,
    };

    return newUser;
  }

  /**
   * Recuperação de conta via SQL
   */
  public static async recoverPassword(email: string): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase();
    const userRecord = await sqlDb.selectUserByEmail(normalizedEmail);

    if (!userRecord) {
      throw new Error('E-mail não localizado na base de dados SQL.');
    }
  }
}
