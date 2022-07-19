export default (url) => {
  const fullUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${url}`;
  return fetch(fullUrl)
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error('Network response was not ok.');
    })
    .then((data) => data.contents)
    .catch(() => {
      throw new Error('netWorkError');
    });
};
