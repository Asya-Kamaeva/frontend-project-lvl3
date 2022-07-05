import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import renderForm from './renderForm.js';
import renderRss from './renderRss.js';

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
  };

  const form = document.querySelector('form');

  const watchedState = onChange(state, (path) => {
    if (path !== watchedState.valid) {
      renderForm(state);
    }
  });

  // const getData = async (url) => {
  //   const response = await axios.get(url);
  //   return response.data;
  // };

  const requestData = async (url) => {
    const response = await axios.get(url);
    const rawData = response.data;
    return rawData;
  };

  const parsingData = async (data) => {
    const parser = new DOMParser();
    const htmlData = parser.parseFromString(data, 'application/xml');
    if (htmlData.querySelector('parsererror')) {
      throw new Error('Must be RSS');
    }
    return htmlData;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const enteredUrl = form.elements.url.value;
    validate(enteredUrl, state.urls)
      .then(() => {
        state.isValid = true;
        e.target.reset();
        watchedState.urls.push(enteredUrl);
      })
      .then(() => requestData(enteredUrl))
      .then((data) => parsingData(data))
      .then((data) => renderRss(data))
      .catch((err) => {
        state.isValid = false;
        watchedState.error = err.type;
      });
  });
};
