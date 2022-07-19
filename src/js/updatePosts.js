import requestData from './requestData.js';
import parsingData from './parsingData.js';
import transformData from './transformData.js';

const updatePosts = (feed, state) => {
  console.log('yeap');
  const newState = {
    feedsData: [],
    postsData: [],
  };
  const link = feed.rssLink;
  const feedId = feed.id;
  const oldTitle = state.postsData
    .filter((post) => post.feedId === feedId)
    .map((item) => item.title);

  requestData(link)
    .then((data) => parsingData(data))
    .then((content) => transformData(content, link, newState, feedId))
    .then(() => newState.postsData.map((item) => item.title))
    .then((data) => data.filter((el) => !oldTitle.includes(el)))
    .then((arr) => {
      if (arr.length > 0) {
        arr.map((el) => {
          const newEl = newState.postsData.find((item) => item.title === el);
          state.postsData.unshift(newEl);
          return newEl;
        });
      }
    })
    .catch((err) => console.log(err));
  setTimeout(() => updatePosts(feed, state), 5000);
};
export default updatePosts;
