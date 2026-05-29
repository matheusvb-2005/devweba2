// isValidation = true faz o erro voltar ao formulario, em vez de renderizar a pagina de erro.
function httpError(status, message, isValidation = false) {
  const err = new Error(message);
  err.status = status;
  err.isValidation = isValidation;
  return err;
}

module.exports = httpError;
