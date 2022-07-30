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
  const { body } = document;
  const modal = document.querySelector('.modal');
  const title = modal.querySelector('.modal-title');
  const desc = modal.querySelector('.modal-body');
  const closeBtns = modal.querySelectorAll('[type="button"]');
  const closeBtn = modal.querySelector('.btn-secondary');
  const link = modal.querySelector('.full-article');
  body.classList.add('modal-open');
  body.setAttribute('style', 'overflow: hidden; padding-right: 0px;');
  modal.classList.add('show');
  modal.setAttribute('style', 'display: block;');
  modal.setAttribute('role', 'dialog');
  modal.removeAttribute('aria-hidden');
  modal.setAttribute('aria-modal', 'true');

  title.textContent = activePost.title;
  desc.innerHTML = activePost.desc;
  link.setAttribute('href', activePost.link);
  link.textContent = i18nextInstance.t('fullArticle');
  closeBtn.textContent = i18nextInstance.t('close');

  const div = document.createElement('div');
  div.classList.add('modal-backdrop', 'fade', 'show');
  body.append(div);

  Array.from(closeBtns).map((btn) => btn.addEventListener('click', () => {
    body.classList.remove('modal-open');
    body.setAttribute('style', '');
    modal.classList.remove('show');
    modal.setAttribute('style', 'display: none;');
    modal.removeAttribute('role');
    modal.removeAttribute('aria-modal');
    modal.setAttribute('aria-hidden', 'true');
    div.remove();
  }));
};
