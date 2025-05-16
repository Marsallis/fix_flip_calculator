const db = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  static async create({ email, password, name }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (email, password, name, created_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      RETURNING id, email, name, created_at;
    `;
    const result = await db.query(query, [email, hashedPassword, name]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, email, name, created_at FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async updateGoogleId(userId, googleId) {
    const query = 'UPDATE users SET google_id = $1 WHERE id = $2 RETURNING *';
    const result = await db.query(query, [googleId, userId]);
    return result.rows[0];
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User; 