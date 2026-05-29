const db = require('../config/database');

const userRepository = {
  create(name, email, passwordHash) {
    const stmt = db.prepare(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'
    );
    const info = stmt.run(name, email, passwordHash);
    return info.lastInsertRowid;
  },

  findByEmail(email) {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  },

  findById(id) {
    return db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?').get(id);
  },
};

module.exports = userRepository;
