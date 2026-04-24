import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

class User {
  // Crear tabla de usuarios
  static async createTable() {
    try {
      const connection = await pool.getConnection();
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      connection.release();
      console.log('✅ Tabla users creada/verificada');
    } catch (error) {
      console.error('❌ Error al crear tabla users:', error.message);
    }
  }

  // Buscar usuario por email
  static async findByEmail(email) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      connection.release();
      return rows[0];
    } catch (error) {
      console.error('Error en findByEmail:', error.message);
      throw error;
    }
  }

  // Crear nuevo usuario
  static async create(email, plainPassword) {
    try {
      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hashedPassword]
      );
      connection.release();

      return {
        id: result.insertId,
        email: email
      };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('El email ya está registrado');
      }
      console.error('Error en create user:', error.message);
      throw error;
    }
  }

  // Verificar contraseña
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error al verificar contraseña:', error.message);
      throw error;
    }
  }

  // Obtener usuario por ID
  static async findById(id) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        'SELECT id, email, created_at FROM users WHERE id = ?',
        [id]
      );
      connection.release();
      return rows[0];
    } catch (error) {
      console.error('Error en findById:', error.message);
      throw error;
    }
  }
}

export default User;
