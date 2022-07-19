export default (obj) => {
  const { body } = document;
  const modal = document.querySelector('.modal');
  const title = modal.querySelector('.modal-title');
  const desc = modal.querySelector('.modal-body');
  const closeBtns = modal.querySelectorAll('[type="button"]');
  const link = modal.querySelector('.full-article');
  body.classList.add('modal-open');
  body.setAttribute('style', 'overflow: hidden; padding-right: 0px;');
  modal.classList.add('show');
  modal.setAttribute('style', 'display: block;');
  modal.setAttribute('role', 'dialog');
  modal.removeAttribute('aria-hidden');
  modal.setAttribute('aria-modal', 'true');

  title.textContent = obj.title;
  desc.innerHTML = obj.desc;
  link.setAttribute('href', obj.link);

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
