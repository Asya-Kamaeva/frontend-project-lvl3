import * as yup from 'yup';
import onChange from 'on-change';
// import axios from 'axios';
import renderForm from './renderForm.js';
import renderRss from './renderRss.js';
import requestData from './requestData.js';
import parsingData from './parsingData.js';
import transformData from './transformData.js';
import updatePosts from './updatePosts.js';
import modalView from './modalView.js';

const baseScheme = yup.string().url().required();

const validate = (currentUrl, urls) => {
  const scheme = baseScheme.notOneOf(urls);
  return scheme.validate(currentUrl);
};
yup.setLocale({
  mixed: {
    required: 'Required Field sdfvsdfvv',
    default: 'Não é válido',
  },
});

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
      renderForm(state);
    }
    if (path === 'content') {
      renderRss(state.content);
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const enteredUrl = form.elements.url.value;
    validate(enteredUrl, state.urls)
      .then(() => requestData(enteredUrl))
      .then((data) => parsingData(data))
      .then((data) => {
        if (data.querySelector('parsererror')) {
          throw new Error('notRss');
        }
        return data;
      })
      .then((data) => {
        e.target.reset();
        watchedState.isValid = true;
        watchedState.urls.push(enteredUrl);
        return data;
      })
      .then((data) => transformData(data, enteredUrl, state.content))
      .then(() => {
        renderRss(state.content);
        state.content.feedsData.map((feed) => {
          setTimeout(() => updatePosts(feed, state.content), 5000);
          return feed;
        });
      })
      .then(() => {
        const btns = document.querySelectorAll('.btn-sm');
        Array.from(btns).map((btn) => {
          const id = btn.getAttribute('data-id');
          btn.addEventListener('click', () => {
            const el = state.content.postsData.filter((post) => post.postId === id)[0];
            el.read = true;
            btn.parentElement.classList.remove('fw-bold');
            btn.parentElement.classList.add('fw-normal', 'link-secondary');
            modalView(el);
          });
          return btn;
        });
      })
      .catch((err) => {
        watchedState.isValid = false;
        watchedState.error = err.type !== undefined ? err.type : err.message;
      });
  });
};
