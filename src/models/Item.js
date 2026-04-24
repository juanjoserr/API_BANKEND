import pool from '../config/database.js';

class Item {
  // Crear tabla de items
  static async createTable() {
    try {
      const connection = await pool.getConnection();
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nombre VARCHAR(255) NOT NULL,
          descripcion TEXT,
          estado ENUM('activo', 'inactivo', 'pendiente') DEFAULT 'activo',
          user_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
      connection.release();
      console.log('✅ Tabla items creada/verificada');
    } catch (error) {
      console.error('❌ Error al crear tabla items:', error.message);
    }
  }

  // Obtener todos los items del usuario
  static async getAllByUser(userId) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM items WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );
      connection.release();
      return rows;
    } catch (error) {
      console.error('Error en getAllByUser:', error.message);
      throw error;
    }
  }

  // Obtener item por ID
  static async getById(id, userId) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM items WHERE id = ? AND user_id = ?',
        [id, userId]
      );
      connection.release();
      return rows[0];
    } catch (error) {
      console.error('Error en getById:', error.message);
      throw error;
    }
  }

  // Crear nuevo item
  static async create(nombre, descripcion, estado, userId) {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'INSERT INTO items (nombre, descripcion, estado, user_id) VALUES (?, ?, ?, ?)',
        [nombre, descripcion, estado || 'activo', userId]
      );
      connection.release();

      return {
        id: result.insertId,
        nombre,
        descripcion,
        estado: estado || 'activo',
        user_id: userId,
        created_at: new Date()
      };
    } catch (error) {
      console.error('Error en create item:', error.message);
      throw error;
    }
  }

  // Actualizar item
  static async update(id, nombre, descripcion, estado, userId) {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'UPDATE items SET nombre = ?, descripcion = ?, estado = ? WHERE id = ? AND user_id = ?',
        [nombre, descripcion, estado, id, userId]
      );
      connection.release();

      if (result.affectedRows === 0) {
        throw new Error('Item no encontrado o no pertenece al usuario');
      }

      return { id, nombre, descripcion, estado };
    } catch (error) {
      console.error('Error en update item:', error.message);
      throw error;
    }
  }

  // Eliminar item
  static async delete(id, userId) {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'DELETE FROM items WHERE id = ? AND user_id = ?',
        [id, userId]
      );
      connection.release();

      if (result.affectedRows === 0) {
        throw new Error('Item no encontrado o no pertenece al usuario');
      }

      return { message: 'Item eliminado correctamente' };
    } catch (error) {
      console.error('Error en delete item:', error.message);
      throw error;
    }
  }
}

export default Item;
