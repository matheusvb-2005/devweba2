document.addEventListener('DOMContentLoaded', function () {
  const forms = document.querySelectorAll('.js-confirm-delete');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      const ok = window.confirm('Tem certeza que deseja excluir? Esta acao nao pode ser desfeita.');
      if (!ok) {
        e.preventDefault();
      }
    });
  });
});
