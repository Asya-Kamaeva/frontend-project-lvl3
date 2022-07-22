import * as yup from 'yup';
import { uniqueId } from 'lodash';
import onChange from 'on-change';
import renderForm from './renderForm.js';
import renderRss from './renderRss.js';
import requestData from './requestData.js';
import parsingData from './parsingData.js';
import updatePosts from './updatePosts.js';
import modalView from './modalView.js';

const baseScheme = yup.string().url().required();

const validate = (currentUrl, urls) => {
  const scheme = baseScheme.notOneOf(urls);
  return scheme.validate(currentUrl);
};

export default () => {
  const state = {
    isValid: false,
    urls: [],
    error: '',
    content: {
      feedsData: [],
      postsData: [],
    },
  };

  const form = document.querySelector('form');

  const watchedState = onChange(state, (path) => {
    if (path === 'urls' || path === 'error') {
      console.log('!!!!!!!! Render Form');
      renderForm(state);
    } else {
      console.log('!!!!!!!! Render Rss');
      renderRss(state.content);
    }
    // if (path === 'content' || path === 'read') {
    //   console.log('!!!!!!!! Render Rss');
    //   renderRss(state.content);
    // }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const enteredUrl = form.elements.url.value;
    validate(enteredUrl, state.urls)
      .then(() => requestData(enteredUrl))
      .then((data) => {
        const dataAfterParsing = parsingData(data);
        const [feed, posts] = dataAfterParsing;
        feed.id = uniqueId();
        feed.rssLink = enteredUrl;
        posts.map((post) => {
          const newData = {
            feedId: feed.id,
            postId: uniqueId(),
            read: false,
          };
          return Object.assign(post, newData);
        });
        e.target.reset();
        watchedState.isValid = true;
        watchedState.urls.push(enteredUrl);
        state.content.feedsData.push(feed);
        state.content.postsData = [...state.content.postsData, ...posts];

        renderRss(state.content);
        state.content.feedsData.map((feed2) => {
          setTimeout(() => updatePosts(feed2, state.content), 5000);
          return feed2;
        });
        const btns = document.querySelectorAll('.btn-sm');
        btns.forEach((btn) => {
          btn.addEventListener('click', () => {
            console.log('click');
            const id = btn.getAttribute('data-id');
            const el = watchedState.content.postsData.filter((post) => post.postId === id)[0];
            el.read = true;

            modalView(el);
          });
        });
      })
      .catch((err) => {
        watchedState.isValid = false;
        watchedState.error = err.type !== undefined ? err.type : err.message;
      });
  });
};
