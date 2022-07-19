import { uniqueId } from 'lodash';

export default (data, url, objState, uniqId = uniqueId()) => {
  const titleFeed = data.querySelector('title');
  const descFeed = data.querySelector('description');
  const items = data.querySelectorAll('item');

  const feed = {
    title: titleFeed.textContent,
    description: descFeed.textContent,
    id: uniqId,
    rssLink: url,
  };
  objState.feedsData.push(feed);

  Array.from(items).map((item) => {
    const post = {
      title: item.querySelector('title').textContent,
      desc: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
      feedId: feed.id,
      postId: uniqueId(),
      read: false,
    };
    objState.postsData.push(post);
    return post;
  });
};
