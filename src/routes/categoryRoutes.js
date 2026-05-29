const express = require('express');
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// authMiddleware vai por rota (e nao com router.use) para que caminhos inexistentes
// cheguem ao handler 404 em vez de serem redirecionados ao login.
router.get('/categories', authMiddleware, categoryController.list);
router.post('/categories', authMiddleware, categoryController.create);
router.post('/categories/:id', authMiddleware, categoryController.update);
router.post('/categories/:id/delete', authMiddleware, categoryController.delete);

module.exports = router;
