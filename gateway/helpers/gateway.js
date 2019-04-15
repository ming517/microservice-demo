import axios from 'axios';

exports.get = async (url, req, res) => {
  try {
    const results = await axios.get(`${url}`, { headers: req.headers });
    return res.json(results.data);
  } catch (e) {
    return res.status(e.response.status).json(e.response.data);
  }
};

exports.post = async (url, req, res) => {
  try {
    const results = await axios.post(`${url}`, req.body, { headers: req.headers });
    return res.json(results.data);
  } catch (e) {
    return res.status(e.response.status).json(e.response.data);
  }
};
