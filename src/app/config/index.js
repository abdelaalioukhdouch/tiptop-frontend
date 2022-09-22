import axios from 'axios';
const API = process.env.APP_API || `https://localhost:8080/api/`;

export default axios.create({
  baseURL: API,
});