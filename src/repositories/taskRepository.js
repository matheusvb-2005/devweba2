const db = require('../config/database');

const taskRepository = {
  create(task) {
    const stmt = db.prepare(`
      INSERT INTO tasks (title, description, status, priority, due_date, category_id, user_id)
      VALUES (@title, @description, @status, @priority, @due_date, @category_id, @user_id)
    `);
    return stmt.run(task).lastInsertRowid;
  },

  findAllByUser(userId, filters = {}) {
    let sql = `
      SELECT t.*, c.name AS category_name, c.color AS category_color
      FROM tasks t
      LEFT JOIN categories c ON c.id = t.category_id
      WHERE t.user_id = ?
    `;
    const params = [userId];

    if (filters.status) {
      sql += ' AND t.status = ?';
      params.push(filters.status);
    }
    if (filters.priority) {
      sql += ' AND t.priority = ?';
      params.push(filters.priority);
    }
    if (filters.categoryId) {
      sql += ' AND t.category_id = ?';
      params.push(filters.categoryId);
    }
    if (filters.search) {
      sql += ' AND (t.title LIKE ? OR t.description LIKE ?)';
      const like = `%${filters.search}%`;
      params.push(like, like);
    }

    sql += ' ORDER BY (t.due_date IS NULL), t.due_date ASC, t.id DESC';
    return db.prepare(sql).all(...params);
  },

  findById(id) {
    return db
      .prepare(`
        SELECT t.*, c.name AS category_name, c.color AS category_color
        FROM tasks t
        LEFT JOIN categories c ON c.id = t.category_id
        WHERE t.id = ?
      `)
      .get(id);
  },

  update(id, task) {
    const stmt = db.prepare(`
      UPDATE tasks
      SET title = @title, description = @description, status = @status,
          priority = @priority, due_date = @due_date, category_id = @category_id
      WHERE id = @id
    `);
    // O better-sqlite3 rejeita parametros nomeados que nao aparecem na query, entao
    // monto o objeto apenas com os campos do UPDATE (sem user_id).
    return stmt.run({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      due_date: task.due_date,
      category_id: task.category_id,
      id,
    });
  },

  delete(id) {
    return db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  },

  countByStatus(userId) {
    return db
      .prepare('SELECT status, COUNT(*) AS total FROM tasks WHERE user_id = ? GROUP BY status')
      .all(userId);
  },

  findUpcoming(userId, limitDate) {
    return db
      .prepare(`
        SELECT t.*, c.name AS category_name, c.color AS category_color
        FROM tasks t
        LEFT JOIN categories c ON c.id = t.category_id
        WHERE t.user_id = ?
          AND t.status != 'concluida'
          AND t.due_date IS NOT NULL
          AND t.due_date <= ?
        ORDER BY t.due_date ASC
      `)
      .all(userId, limitDate);
  },
};

module.exports = taskRepository;
