const input = document.getElementById('url-input');
const message = document.querySelector('.feedback');

export default (state, i18nextInstance) => {
  if (!state.isValidForm) {
    message.textContent = '';
    input.classList.add('is-invalid');
    message.classList.add('text-danger');
    message.textContent = i18nextInstance.t(state.error);
  }
  if (state.isValidForm) {
    input.classList.remove('is-invalid');
    message.classList.remove('text-danger');
    message.classList.add('text-success');
    message.textContent = i18nextInstance.t('success');
  }
};
