import requestData from './requestData.js';
import parsingData from './parsingData.js';

const updatePosts = (state) => {
  const feeds = state.content.feedsData;
  feeds.map((feed) => {
    const link = feed.rssLink;
    const feedId = feed.id;
    const oldTitle = state.content.postsData
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
            state.content.postsData.unshift(newEl);
            return newEl;
          });
        }
      })
      .then(() => setTimeout(() => updatePosts(state), 5000))
      .catch(() => {
        throw new Error('Error in updatePost file');
      });
    return feed;
  });
};
export default updatePosts;
