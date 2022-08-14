const getFullUrl = (url) => `https://allorigins.hexlet.app/get?disableCache=true&url=${url}`;

export default (url) => {
  const fullUrl = getFullUrl(url);
  return fetch(fullUrl)
    .then((response) => response.json())
    .then((data) => data.contents)
    .catch(() => {
      throw new Error('netWorkError');
    });
};
