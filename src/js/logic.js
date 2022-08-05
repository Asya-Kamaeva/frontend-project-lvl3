import * as yup from 'yup';
import onChange from 'on-change';
import { uniqueId } from 'lodash';
import i18n from 'i18next';
import ruResource from '../locales/ru.js';
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
    modal: {
      postId: '',
    },
  };

  const form = document.querySelector('form');

  const i18nextInstance = i18n.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru: ruResource,
    },
  }).then(() => {
    const watchedState = onChange(state, (path) => {
      switch (path) {
        case 'urls':
        case 'error':
          renderForm(state, i18nextInstance);
          break;
        case 'modal.postId':
          renderRss(watchedState, i18nextInstance);
          modalView(state, i18nextInstance);
          break;
        case 'content.postsData':
        case 'content.feedsData':
          renderRss(watchedState, i18nextInstance);
          break;
        default:
          break;
      }
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
            const fullPost = Object.assign(post, newData);
            state.content.postsData.push(fullPost);
            return fullPost;
          });
          e.target.reset();
          state.isValid = true;
          watchedState.urls.push(enteredUrl);
          watchedState.content.feedsData.push(feed);
          setTimeout(() => updatePosts(watchedState), 5000);
        })
        .catch((err) => {
          watchedState.isValid = false;
          watchedState.error = err.type !== undefined ? err.type : err.message;
        });
    });
  });
};
