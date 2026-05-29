const authService = require('../services/authService');

const authController = {
  showLogin(req, res) {
    if (req.session.userId) return res.redirect('/dashboard');
    res.render('auth/login', {
      title: 'Entrar',
      error: req.query.error || null,
      msg: req.query.msg || null,
      user: null,
    });
  },

  login(req, res, next) {
    try {
      const user = authService.login(req.body);
      req.session.userId = user.id;
      req.session.user = { id: user.id, name: user.name, email: user.email };
      res.redirect('/dashboard');
    } catch (err) {
      next(err);
    }
  },

  showRegister(req, res) {
    if (req.session.userId) return res.redirect('/dashboard');
    res.render('auth/register', {
      title: 'Criar conta',
      error: req.query.error || null,
      user: null,
    });
  },

  register(req, res, next) {
    try {
      authService.register(req.body);
      res.redirect('/login?msg=' + encodeURIComponent('Conta criada! Faca login.'));
    } catch (err) {
      next(err);
    }
  },

  logout(req, res) {
    req.session.destroy(() => {
      res.redirect('/login');
    });
  },
};

module.exports = authController;
