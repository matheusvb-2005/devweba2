const taskRepository = require('../repositories/taskRepository');
const categoryRepository = require('../repositories/categoryRepository');
const httpError = require('../utils/httpError');

const STATUSES = ['pendente', 'em-andamento', 'concluida'];
const PRIORITIES = ['baixa', 'media', 'alta'];

const STATUS_LABELS = {
  pendente: 'Pendente',
  'em-andamento': 'Em andamento',
  concluida: 'Concluida',
};
const PRIORITY_LABELS = {
  baixa: 'Baixa',
  media: 'Media',
  alta: 'Alta',
};

function getOwned(id, userId) {
  const task = taskRepository.findById(id);
  if (!task) {
    throw httpError(404, 'Tarefa nao encontrada.');
  }
  if (task.user_id !== userId) {
    throw httpError(403, 'Voce nao tem permissao sobre esta tarefa.');
  }
  return task;
}

function normalize(userId, body) {
  const title = (body.title || '').trim();
  if (!title) {
    throw httpError(400, 'O titulo da tarefa e obrigatorio.', true);
  }

  const status = STATUSES.includes(body.status) ? body.status : 'pendente';
  const priority = PRIORITIES.includes(body.priority) ? body.priority : 'media';

  let categoryId = body.category_id ? Number(body.category_id) : null;
  if (categoryId) {
    // Ignora categoria que nao seja do proprio usuario, evitando vincular tarefa a categoria alheia.
    const category = categoryRepository.findById(categoryId);
    if (!category || category.user_id !== userId) {
      categoryId = null;
    }
  }

  const dueDate = (body.due_date || '').trim() || null;

  return {
    title,
    description: (body.description || '').trim() || null,
    status,
    priority,
    due_date: dueDate,
    category_id: categoryId,
    user_id: userId,
  };
}

const taskService = {
  STATUSES,
  PRIORITIES,
  STATUS_LABELS,
  PRIORITY_LABELS,

  listByUser(userId, filters) {
    return taskRepository.findAllByUser(userId, filters);
  },

  getForEdit(userId, id) {
    return getOwned(id, userId);
  },

  create(userId, body) {
    const task = normalize(userId, body);
    return taskRepository.create(task);
  },

  update(userId, id, body) {
    getOwned(id, userId);
    const task = normalize(userId, body);
    taskRepository.update(id, task);
  },

  delete(userId, id) {
    getOwned(id, userId);
    taskRepository.delete(id);
  },

  getDashboard(userId) {
    const counts = { pendente: 0, 'em-andamento': 0, concluida: 0 };
    for (const row of taskRepository.countByStatus(userId)) {
      if (counts[row.status] !== undefined) {
        counts[row.status] = row.total;
      }
    }

    const limit = new Date();
    limit.setDate(limit.getDate() + 3);
    const limitDate = limit.toISOString().slice(0, 10);
    const upcoming = taskRepository.findUpcoming(userId, limitDate);

    const total = counts.pendente + counts['em-andamento'] + counts.concluida;
    return { counts, total, upcoming };
  },
};

module.exports = taskService;
