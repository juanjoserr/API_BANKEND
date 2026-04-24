import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Crear pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  ssl: { rejectUnauthorized: false } // 🔒 Aiven requiere SSL (cert auto-firmado)
});

// Probar conexión
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a MySQL exitosa');
    connection.release();
  } catch (error) {
    console.error('❌ Error al conectar a MySQL:', error.message);
    setTimeout(testConnection, 5000);
  }
};

testConnection();

export default pool;
