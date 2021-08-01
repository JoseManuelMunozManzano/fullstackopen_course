import axios from 'axios';

//const baseUrl = 'http://localhost:3001/api/persons';
const baseUrl = '/api/persons';

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => [...response.data]);
};

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
};

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data);
};

const deleteElement = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

const personService = {
  getAll,
  create,
  update,
  deleteElement,
};

export default personService;
