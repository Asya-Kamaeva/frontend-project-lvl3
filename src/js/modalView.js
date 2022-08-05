export default (state, i18nextInstance) => {
  const id = state.modal.postId;
  const activePost = state.content.postsData.find((el) => el.postId === id);
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
