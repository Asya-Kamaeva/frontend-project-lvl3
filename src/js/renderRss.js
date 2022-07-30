import i18n from 'i18next';
import ruResource from '../locales/ru.js';

export default (state) => {
  const i18nextInstance = i18n.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru: ruResource,
    },
  });
  const posts = document.querySelector('.posts');
  const feeds = document.querySelector('.feeds');
  const postTitle = posts.querySelector('.card-title');
  const postList = posts.querySelector('.list-group');
  const feedsTitle = feeds.querySelector('.card-title');
  const feedsList = feeds.querySelector('.list-group');

  postTitle.textContent = 'Посты';
  feedsTitle.textContent = 'Фиды';

  postList.innerHTML = '';
  feedsList.innerHTML = '';

  state.feedsData.map((feed) => {
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
  state.postsData.map((post) => {
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
    if (post.read === false) {
      linkPost.classList.add('fw-bold');
    }
    if (post.read === true) {
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
};
