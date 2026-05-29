const express = require('express');
const authRoutes = require('./authRoutes');
const taskRoutes = require('./taskRoutes');
const categoryRoutes = require('./categoryRoutes');

const router = express.Router();

router.get('/', (req, res) => {
  if (req.session && req.session.userId) {
    return res.redirect('/dashboard');
  }
  res.redirect('/login');
});

router.use('/', authRoutes);
router.use('/', taskRoutes);
router.use('/', categoryRoutes);

module.exports = router;
