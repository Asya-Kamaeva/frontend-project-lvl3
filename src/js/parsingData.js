export default async (data) => {
  const parser = new DOMParser();
  const htmlData = parser.parseFromString(data, 'application/xml');
  return htmlData;
};
