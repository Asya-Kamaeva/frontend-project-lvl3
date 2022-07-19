import i18n from 'i18next';
import ruResource from '../locales/ru.js';

const input = document.getElementById('url-input');
const message = document.querySelector('.feedback');

export default (obj) => {
  const i18nextInstance = i18n.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru: ruResource,
    },
  });
  if (!obj.isValid) {
    message.textContent = '';
    input.classList.add('is-invalid');
    message.classList.add('text-danger');
    switch (obj.error) {
      case 'url':
        message.textContent = i18nextInstance.t('url');
        break;
      case 'notOneOf':
        message.textContent = i18nextInstance.t('notOneOf');
        break;
      case 'notRss':
        message.textContent = i18nextInstance.t('notRss');
        break;
      case 'netWorkError':
        message.textContent = i18nextInstance.t('netWorkError');
        break;
      default:
        throw new Error(`Unknown value ${obj.error}`);
    }
  }
  if (obj.isValid) {
    input.classList.remove('is-invalid');
    message.classList.remove('text-danger');
    message.classList.add('text-success');
    message.textContent = i18nextInstance.t('success');
  }
};
