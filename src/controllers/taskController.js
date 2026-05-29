const taskService = require('../services/taskService');
const categoryService = require('../services/categoryService');

const taskController = {
  dashboard(req, res, next) {
    try {
      const data = taskService.getDashboard(req.session.userId);
      res.render('dashboard', {
        title: 'Painel',
        counts: data.counts,
        total: data.total,
        upcoming: data.upcoming,
        statusLabels: taskService.STATUS_LABELS,
        priorityLabels: taskService.PRIORITY_LABELS,
        user: req.session.user,
      });
    } catch (err) {
      next(err);
    }
  },

  list(req, res, next) {
    try {
      const userId = req.session.userId;
      const filters = {
        status: req.query.status || '',
        priority: req.query.priority || '',
        categoryId: req.query.category ? Number(req.query.category) : '',
        search: (req.query.search || '').trim(),
      };

      const tasks = taskService.listByUser(userId, filters);
      const categories = categoryService.listByUser(userId);

      res.render('tasks/list', {
        title: 'Tarefas',
        tasks,
        categories,
        filters,
        statuses: taskService.STATUSES,
        priorities: taskService.PRIORITIES,
        statusLabels: taskService.STATUS_LABELS,
        priorityLabels: taskService.PRIORITY_LABELS,
        error: req.query.error || null,
        user: req.session.user,
      });
    } catch (err) {
      next(err);
    }
  },

  showCreate(req, res, next) {
    try {
      const categories = categoryService.listByUser(req.session.userId);
      res.render('tasks/form', {
        title: 'Nova tarefa',
        task: null,
        categories,
        statuses: taskService.STATUSES,
        priorities: taskService.PRIORITIES,
        statusLabels: taskService.STATUS_LABELS,
        priorityLabels: taskService.PRIORITY_LABELS,
        error: req.query.error || null,
        user: req.session.user,
      });
    } catch (err) {
      next(err);
    }
  },

  create(req, res, next) {
    try {
      taskService.create(req.session.userId, req.body);
      res.redirect('/tasks');
    } catch (err) {
      next(err);
    }
  },

  showEdit(req, res, next) {
    try {
      const task = taskService.getForEdit(req.session.userId, req.params.id);
      const categories = categoryService.listByUser(req.session.userId);
      res.render('tasks/form', {
        title: 'Editar tarefa',
        task,
        categories,
        statuses: taskService.STATUSES,
        priorities: taskService.PRIORITIES,
        statusLabels: taskService.STATUS_LABELS,
        priorityLabels: taskService.PRIORITY_LABELS,
        error: req.query.error || null,
        user: req.session.user,
      });
    } catch (err) {
      next(err);
    }
  },

  update(req, res, next) {
    try {
      taskService.update(req.session.userId, req.params.id, req.body);
      res.redirect('/tasks');
    } catch (err) {
      next(err);
    }
  },

  delete(req, res, next) {
    try {
      taskService.delete(req.session.userId, req.params.id);
      res.redirect('/tasks');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = taskController;
