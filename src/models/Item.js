import pool from '../config/database.js';

class Item {
  // Crear tabla de items con campos de inventario
  static async createTable() {
    try {
      const connection = await pool.getConnection();
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nombre VARCHAR(255) NOT NULL,
          descripcion TEXT,
          estado ENUM('activo', 'inactivo', 'pendiente') DEFAULT 'activo',
          price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
          stock INT NOT NULL DEFAULT 0,
          categoria VARCHAR(100) DEFAULT 'general',
          user_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);

      const [columns] = await connection.execute(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'items'
           AND COLUMN_NAME IN ('price', 'stock', 'categoria')`,
        [process.env.DB_NAME]
      );

      const existing = columns.map((row) => row.COLUMN_NAME);
      const alterations = [];

      if (!existing.includes('price')) {
        alterations.push(`ALTER TABLE items ADD COLUMN price DECIMAL(10,2) NOT NULL DEFAULT 0.00`);
      }
      if (!existing.includes('stock')) {
        alterations.push(`ALTER TABLE items ADD COLUMN stock INT NOT NULL DEFAULT 0`);
      }
      if (!existing.includes('categoria')) {
        alterations.push(`ALTER TABLE items ADD COLUMN categoria VARCHAR(100) DEFAULT 'general'`);
      }

      for (const sql of alterations) {
        await connection.execute(sql);
      }

      connection.release();
      console.log('✅ Tabla items creada/verificada');
    } catch (error) {
      console.error('❌ Error al crear tabla items:', error.message);
    }
  }

  static async findByNameAndUser(nombre, userId) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        'SELECT * FROM items WHERE nombre = ? AND user_id = ?',
        [nombre, userId]
      );
      connection.release();
      return rows[0];
    } catch (error) {
      console.error('Error en findByNameAndUser:', error.message);
      throw error;
    }
  }

  // Obtener todos los items del usuario
  static async getAllByUser(userId) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute(
        `SELECT id, nombre, descripcion, estado, price, stock, categoria, user_id, created_at, updated_at,
          price * stock AS valor_total
         FROM items WHERE user_id = ? ORDER BY created_at DESC`,
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
        `SELECT id, nombre, descripcion, estado, price, stock, categoria, user_id, created_at, updated_at,
          price * stock AS valor_total
         FROM items WHERE id = ? AND user_id = ?`,
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
  static async create(nombre, descripcion, estado, price, stock, categoria, userId) {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'INSERT INTO items (nombre, descripcion, estado, price, stock, categoria, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nombre, descripcion, estado || 'activo', price, stock, categoria || 'general', userId]
      );
      connection.release();

      return {
        id: result.insertId,
        nombre,
        descripcion,
        estado: estado || 'activo',
        price,
        stock,
        categoria: categoria || 'general',
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date(),
        valor_total: Number((price * stock).toFixed(2))
      };
    } catch (error) {
      console.error('Error en create item:', error.message);
      throw error;
    }
  }

  // Actualizar item
  static async update(id, nombre, descripcion, estado, price, stock, categoria, userId) {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.execute(
        'UPDATE items SET nombre = ?, descripcion = ?, estado = ?, price = ?, stock = ?, categoria = ? WHERE id = ? AND user_id = ?',
        [nombre, descripcion, estado, price, stock, categoria || 'general', id, userId]
      );
      connection.release();

      if (result.affectedRows === 0) {
        throw new Error('Item no encontrado o no pertenece al usuario');
      }

      return {
        id,
        nombre,
        descripcion,
        estado,
        price,
        stock,
        categoria: categoria || 'general',
        valor_total: Number((price * stock).toFixed(2))
      };
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
