const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');
const httpError = require('../utils/httpError');

const SALT_ROUNDS = 10;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const authService = {
  register({ name, email, password, confirm }) {
    name = (name || '').trim();
    email = (email || '').trim().toLowerCase();

    if (!name || !email || !password) {
      throw httpError(400, 'Preencha nome, e-mail e senha.', true);
    }
    if (!EMAIL_REGEX.test(email)) {
      throw httpError(400, 'Informe um e-mail valido.', true);
    }
    if (password.length < 6) {
      throw httpError(400, 'A senha deve ter ao menos 6 caracteres.', true);
    }
    if (confirm !== undefined && password !== confirm) {
      throw httpError(400, 'As senhas nao coincidem.', true);
    }
    if (userRepository.findByEmail(email)) {
      throw httpError(409, 'Ja existe uma conta com este e-mail.', true);
    }

    const hash = bcrypt.hashSync(password, SALT_ROUNDS);
    return userRepository.create(name, email, hash);
  },

  login({ email, password }) {
    email = (email || '').trim().toLowerCase();
    if (!email || !password) {
      throw httpError(400, 'Informe e-mail e senha.', true);
    }

    const user = userRepository.findByEmail(email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw httpError(401, 'E-mail ou senha incorretos.', true);
    }

    return { id: user.id, name: user.name, email: user.email };
  },
};

module.exports = authService;
