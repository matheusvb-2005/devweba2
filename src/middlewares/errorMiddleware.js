function notFound(req, res, next) {
  const err = new Error('Pagina nao encontrada.');
  err.status = 404;
  next(err);
}

function errorHandler(err, req, res, next) {
  const status = err.status || 500;

  // erros de validacao voltam ao formulario de origem, em vez da pagina de erro.
  if (err.isValidation && req.get('Referer')) {
    const url = new URL(req.get('Referer'));
    url.searchParams.set('error', err.message);
    return res.redirect(url.pathname + url.search);
  }

  const messages = {
    403: 'Acesso negado.',
    404: 'Pagina nao encontrada.',
    500: 'Erro interno do servidor.',
  };

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).render('error', {
    title: `Erro ${status}`,
    status,
    message: err.message || messages[status] || 'Ocorreu um erro.',
    user: req.session ? req.session.user : null,
  });
}

module.exports = { notFound, errorHandler };
