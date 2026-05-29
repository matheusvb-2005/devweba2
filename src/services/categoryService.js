const categoryRepository = require('../repositories/categoryRepository');
const db = require('../config/database');
const httpError = require('../utils/httpError');

const COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;

function getOwned(id, userId) {
  const category = categoryRepository.findById(id);
  if (!category) {
    throw httpError(404, 'Categoria nao encontrada.');
  }
  if (category.user_id !== userId) {
    throw httpError(403, 'Voce nao tem permissao sobre esta categoria.');
  }
  return category;
}

const categoryService = {
  listByUser(userId) {
    return categoryRepository.findAllByUser(userId);
  },

  create(userId, { name, color }) {
    name = (name || '').trim();
    color = (color || '#6c757d').trim();

    if (!name) {
      throw httpError(400, 'O nome da categoria e obrigatorio.', true);
    }
    if (!COLOR_REGEX.test(color)) {
      color = '#6c757d';
    }
    if (categoryRepository.findByNameAndUser(name, userId)) {
      throw httpError(409, 'Ja existe uma categoria com este nome.', true);
    }

    return categoryRepository.create(name, color, userId);
  },

  update(userId, id, { name, color }) {
    getOwned(id, userId);
    name = (name || '').trim();
    color = (color || '#6c757d').trim();

    if (!name) {
      throw httpError(400, 'O nome da categoria e obrigatorio.', true);
    }
    if (!COLOR_REGEX.test(color)) {
      color = '#6c757d';
    }
    const existing = categoryRepository.findByNameAndUser(name, userId);
    if (existing && existing.id !== Number(id)) {
      throw httpError(409, 'Ja existe uma categoria com este nome.', true);
    }

    categoryRepository.update(id, name, color);
  },

  // Excluir a categoria desvincula as tarefas (category_id vira NULL via ON DELETE SET NULL).
  delete(userId, id) {
    getOwned(id, userId);
    const tx = db.transaction(() => {
      categoryRepository.delete(id);
    });
    tx();
  },
};

module.exports = categoryService;
