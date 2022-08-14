const posts = document.querySelector('.posts');
const feeds = document.querySelector('.feeds');
const input = document.querySelector('#url-input');
const postTitle = posts.querySelector('.card-title');
const postList = posts.querySelector('.list-group');
const feedsTitle = feeds.querySelector('.card-title');
const feedsList = feeds.querySelector('.list-group');

const modalView = (state, i18nextInstance) => {
  const id = state.modal.clickId;
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

export default (state, i18nextInstance) => {
  postTitle.textContent = i18nextInstance.t('posts');
  feedsTitle.textContent = i18nextInstance.t('feeds');

  postList.innerHTML = '';
  feedsList.innerHTML = '';
  input.value = '';

  state.content.feedsData.map((feed) => {
    const liFeeds = document.createElement('li');
    liFeeds.classList.add('list-group-item', 'border-0', 'border-end-0');
    const captureFeeds = document.createElement('h3');
    captureFeeds.classList.add('h6', 'm-0');
    captureFeeds.textContent = feed.title;
    const descFeeds = document.createElement('p');
    descFeeds.classList.add('m-0', 'small', 'text-black-50');
    descFeeds.textContent = feed.description;
    liFeeds.append(captureFeeds, descFeeds);
    feedsList.append(liFeeds);
    return feed;
  });
  state.content.postsData.map((post) => {
    const liPost = document.createElement('li');
    liPost.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );
    const linkPost = document.createElement('a');
    linkPost.setAttribute('href', post.link);
    linkPost.setAttribute('target', '_blank');
    linkPost.setAttribute('rel', 'noopener noreferrer');
    linkPost.setAttribute('data-id', post.postId);
    linkPost.textContent = post.title;
    linkPost.classList.add('fw-bold');
    if (state.modal.readedId.indexOf(post.postId) !== -1) {
      linkPost.classList.remove('fw-bold');
      linkPost.classList.add('fw-normal', 'link-secondary');
    }
    const btnPost = document.createElement('button');
    btnPost.setAttribute('type', 'button');
    btnPost.setAttribute('data-id', post.postId);
    btnPost.setAttribute('data-bs-toggle', 'modal');
    btnPost.setAttribute('data-bs-target', '#modal');
    btnPost.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    btnPost.textContent = i18nextInstance.t('show');
    liPost.append(linkPost, btnPost);
    postList.append(liPost);
    return liPost;
  });
  postList.addEventListener('click', (e) => {
    if (e.target.type === 'button') {
      const id = e.target.getAttribute('data-id');
      state.modal.clickId = id;
      state.modal.readedId.push(id);
      modalView(state, i18nextInstance);
    }
  });
};
