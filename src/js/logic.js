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

const baseScheme = yup.string().url().required();

const validate = (currentUrl, urls) => {
  const scheme = baseScheme.notOneOf(urls);
  return scheme.validate(currentUrl);
};

export default () => {
  const state = {
    isValidForm: false,
    stateOfFeed: '',
    urls: [],
    error: '',
    content: {
      feedsData: [],
      postsData: [],
    },
    modal: {
      clickId: '',
      readedId: [],
    },
  };

  const form = document.querySelector('form');
  const input = document.querySelector('#url-input');
  const submitBtn = document.querySelector('[type="submit"]');

  const i18nextInstance = i18n.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru: ruResource,
    },
  }).then(() => {
    const watchedState = onChange(state, (path, value) => {
      switch (path) {
        case 'urls':
        case 'error':
          renderForm(state, i18nextInstance);
          break;
        case 'stateOfFeed':
          if (value === 'processing') {
            input.setAttribute('readonly', 'readonly');
            submitBtn.disabled = true;
          }
          if (value === 'processed') {
            input.removeAttribute('readonly');
            submitBtn.disabled = false;
          }
          if (value === 'failed') {
            input.removeAttribute('readonly');
            submitBtn.disabled = false;
          }
          break;
        case 'modal.clickId':
        case 'modal.readedId':
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
        .then(() => {
          watchedState.stateOfFeed = 'processing';
          return requestData(enteredUrl);
        })
        .then((data) => {
          const dataAfterParsing = parsingData(data);
          watchedState.isValidForm = true;
          watchedState.urls.push(enteredUrl);
          const [feed, posts] = dataAfterParsing;
          feed.id = uniqueId();
          feed.rssLink = enteredUrl;
          posts.forEach((post) => {
            const newData = {
              feedId: feed.id,
              postId: uniqueId(),
            };
            const fullPost = Object.assign(post, newData);
            state.content.postsData.push(fullPost);
          });
          watchedState.stateOfFeed = 'processed';
          watchedState.content.feedsData.push(feed);
        })
        .catch((err) => {
          if (err.name === 'ValidationError' || err.name === 'Error') {
            watchedState.isValidForm = false;
          }
          watchedState.stateOfFeed = 'failed';
          watchedState.error = err.type !== undefined ? err.type : err.message;
        });
    });
    setTimeout(() => updatePosts(watchedState), 5000);
  });
};
