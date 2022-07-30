import i18n from 'i18next';
import ruResource from '../locales/ru.js';

const input = document.getElementById('url-input');
const message = document.querySelector('.feedback');

export default (state) => {
  const i18nextInstance = i18n.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru: ruResource,
    },
  });
  if (!state.isValid) {
    message.textContent = '';
    input.classList.add('is-invalid');
    message.classList.add('text-danger');
    message.textContent = i18nextInstance.t(state.error);
  }
  if (state.isValid) {
    input.classList.remove('is-invalid');
    message.classList.remove('text-danger');
    message.classList.add('text-success');
    message.textContent = i18nextInstance.t('success');
  }
};
