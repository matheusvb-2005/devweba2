const db = require('../config/database');

const categoryRepository = {
  create(name, color, userId) {
    const stmt = db.prepare(
      'INSERT INTO categories (name, color, user_id) VALUES (?, ?, ?)'
    );
    return stmt.run(name, color, userId).lastInsertRowid;
  },

  findAllByUser(userId) {
    return db
      .prepare('SELECT * FROM categories WHERE user_id = ? ORDER BY name COLLATE NOCASE')
      .all(userId);
  },

  findById(id) {
    return db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
  },

  findByNameAndUser(name, userId) {
    return db
      .prepare('SELECT * FROM categories WHERE name = ? AND user_id = ?')
      .get(name, userId);
  },

  update(id, name, color) {
    return db
      .prepare('UPDATE categories SET name = ?, color = ? WHERE id = ?')
      .run(name, color, id);
  },

  delete(id) {
    return db.prepare('DELETE FROM categories WHERE id = ?').run(id);
  },
};

module.exports = categoryRepository;
