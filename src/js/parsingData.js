export default (data) => {
  const parser = new DOMParser();
  const htmlData = parser.parseFromString(data, 'application/xml');

  try {
    const titleFeed = htmlData.querySelector('title');
    const descFeed = htmlData.querySelector('description');
    const items = htmlData.querySelectorAll('item');

    const feed = {
      title: titleFeed.textContent,
      description: descFeed.textContent,
    };

    const posts = Array.from(items).map((item) => {
      const post = {
        title: item.querySelector('title').textContent,
        desc: item.querySelector('description').textContent,
        link: item.querySelector('link').textContent,
      };
      return post;
    });
    return [feed, posts];
  } catch (err) {
    throw new Error('notRss');
  }
};
