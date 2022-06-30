import * as yup from 'yup';
import onChange from 'on-change';
import render from './render.js';

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
  };

  const form = document.querySelector('form');

  const watchedState = onChange(state, (path) => {
    if (path !== watchedState.valid) {
      render(state);
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const enteredUrl = form.elements.url.value;
    validate(enteredUrl, state.urls)
      .then(() => {
        watchedState.isValid = true;
        watchedState.urls.push(enteredUrl);
        e.target.reset();
      })
      .catch((err) => {
        watchedState.isValid = false;
        watchedState.error = err.message;
      });
  });
};
