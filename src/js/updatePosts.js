import _ from 'lodash';
import requestData from './requestData.js';
import parsingData from './parsingData.js';

const updatePosts = (state) => {
  const feeds = state.content.feedsData;
  const oldPosts = state.content.postsData;
  const updateProcess = feeds.map((feed) => {
    requestData(feed.rssLink)
      .then((data) => {
        const [, posts] = parsingData(data);
        const newPosts = posts.filter((post) => {
          const current = Boolean(oldPosts.find((currentPost) => currentPost.link === post.link));
          return !current;
        });
        if (newPosts.length > 0) {
          newPosts.forEach((post) => {
            const newData = {
              feedId: feed.id,
              postId: _.uniqueId(),
            };
            const fullPost = Object.assign(post, newData);
            state.content.postsData.unshift(fullPost);
            return post;
          });
        }
      })
      .catch(() => {
        throw new Error('Error in updatePost file');
      });
    return feed;
  });
  Promise.all(updateProcess)
    .then(() => setTimeout(() => updatePosts(state), 5000));
};
export default updatePosts;
