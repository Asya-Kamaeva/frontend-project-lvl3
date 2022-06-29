import * as yup from 'yup';
import onChange from 'on-change';

const baseScheme = yup.string().url().required();

const validate = (currentUrl, urls) => {
  const scheme = baseScheme.notOneOf(urls);
  scheme.validate(currentUrl);
};

export default () => {
  const state = {
    state: '',
    urls: [],
    errors: '',
  };
  const form = document.querySelector('form');
  const input = document.getElementById('url-input');
  const submit = document.querySelector('[type="submit"]');

  const render = (obj) => {
    console.log('запрос рендера');
  };
  const watchedState = onChange(state, (path, value) => {
    console.log('изменен стейт');
    render(state);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = input.value;
    // вот здесь не могу перехватить ошибку из функции, не понимаю почему
    validate(url, state.urls).then(() => console.log('success').catch((err) => console.log(err)));
  });
};
