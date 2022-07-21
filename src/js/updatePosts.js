import requestData from './requestData.js';
import parsingData from './parsingData.js';

const updatePosts = (feed, state) => {
  console.log('yeap');
  const link = feed.rssLink;
  const feedId = feed.id;
  const oldTitle = state.postsData
    .filter((post) => post.feedId === feedId)
    .map((item) => item.title);

  requestData(link)
    .then((data) => {
      const [, posts] = parsingData(data);
      const titles = posts.map((item) => item.title);
      const newTitles = titles.filter((el) => !oldTitle.includes(el));
      if (newTitles.length > 0) {
        newTitles.map((el) => {
          const newEl = posts.find((item) => item.title === el);
          state.postsData.unshift(newEl);
          return newEl;
        });
      }
    })
    .then(() => setTimeout(() => updatePosts(feed, state), 5000))
    .catch(() => {
      throw new Error('Error in updatePost file');
    });
};
export default updatePosts;
