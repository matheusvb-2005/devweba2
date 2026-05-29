const express = require('express');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// authMiddleware vai por rota (e nao com router.use) para que caminhos inexistentes
// cheguem ao handler 404 em vez de serem redirecionados ao login.
router.get('/dashboard', authMiddleware, taskController.dashboard);

router.get('/tasks', authMiddleware, taskController.list);
router.get('/tasks/new', authMiddleware, taskController.showCreate);
router.post('/tasks', authMiddleware, taskController.create);
router.get('/tasks/:id/edit', authMiddleware, taskController.showEdit);
router.post('/tasks/:id', authMiddleware, taskController.update);
router.post('/tasks/:id/delete', authMiddleware, taskController.delete);

module.exports = router;
