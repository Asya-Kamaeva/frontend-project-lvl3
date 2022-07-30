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
    modal: {
      postId: '',
    },
  };

  const form = document.querySelector('form');

  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'urls':
      case 'error':
        renderForm(state);
        break;
      case 'modal.postId':
        modalView(state);
        break;
      default:
        renderRss(state.content);
        clickHandler();
    }
  });

  const clickHandler = () => {
    const list = document.querySelector('.list-group');
    list.addEventListener('click', (e) => {
      if (e.target.type === 'button') {
        const id = e.target.getAttribute('data-id');
        const el = watchedState.content.postsData.find((post) => post.postId === id);
        el.read = true;
        watchedState.modal.postId = id;
      }
    });
  };

  // const clickHandler = () => {
  //   const btns = document.querySelectorAll('.btn-sm');
  //   btns.forEach((btn) => {
  //     btn.addEventListener('click', () => {
  //       const id = btn.getAttribute('data-id');
  //       const el = watchedState.content.postsData.filter((post) => post.postId === id)[0];
  //       el.read = true;
  //       watchedState.modal.postId = id;
  //     });
  //   });
  // };

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
        state.content.feedsData.push(feed);
        renderRss(state.content);
        clickHandler();
        state.content.feedsData.map((eachFeed) => {
          setTimeout(() => updatePosts(eachFeed, state.content), 5000);
          return eachFeed;
        });
      })
      .catch((err) => {
        watchedState.isValid = false;
        watchedState.error = err.type !== undefined ? err.type : err.message;
      });
  });
};
