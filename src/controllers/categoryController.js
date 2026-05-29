const categoryService = require('../services/categoryService');

const categoryController = {
  list(req, res, next) {
    try {
      const userId = req.session.userId;
      const categories = categoryService.listByUser(userId);

      let editing = null;
      if (req.query.edit) {
        editing = categories.find((c) => c.id === Number(req.query.edit)) || null;
      }

      res.render('categories/index', {
        title: 'Categorias',
        categories,
        editing,
        error: req.query.error || null,
        user: req.session.user,
      });
    } catch (err) {
      next(err);
    }
  },

  create(req, res, next) {
    try {
      categoryService.create(req.session.userId, req.body);
      res.redirect('/categories');
    } catch (err) {
      next(err);
    }
  },

  update(req, res, next) {
    try {
      categoryService.update(req.session.userId, req.params.id, req.body);
      res.redirect('/categories');
    } catch (err) {
      next(err);
    }
  },

  delete(req, res, next) {
    try {
      categoryService.delete(req.session.userId, req.params.id);
      res.redirect('/categories');
    } catch (err) {
      next(err);
    }
  },
};

module.exports = categoryController;
