import i18n from 'i18next';
import ruResource from '../locales/ru.js';

export default (state) => {
  const id = state.modal.postId;
  const activePost = state.content.postsData.find((el) => el.postId === id);
  const i18nextInstance = i18n.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru: ruResource,
    },
  });
  const modal = document.querySelector('.modal');
  const title = modal.querySelector('.modal-title');
  const desc = modal.querySelector('.modal-body');
  const closeBtn = modal.querySelector('.btn-secondary');
  const link = modal.querySelector('.full-article');
  title.textContent = activePost.title;
  desc.innerHTML = activePost.desc;
  link.setAttribute('href', activePost.link);
  link.textContent = i18nextInstance.t('fullArticle');
  closeBtn.textContent = i18nextInstance.t('close');
};
