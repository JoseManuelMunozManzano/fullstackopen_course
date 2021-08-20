import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const unsetToken = () => {
  token = null;
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const put = async (newObject) => {
  const { user, likes, author, title, url } = newObject;

  const blog = { user, likes, author, title, url };

  const response = await axios.put(`${baseUrl}/${newObject.id}`, blog);
  return response.data;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const result = {
  getAll,
  setToken,
  unsetToken,
  create,
  put,
};

export default result;
