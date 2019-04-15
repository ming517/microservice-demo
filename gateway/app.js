
import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import routes from './routes';

require('dotenv').config();

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false,
}));

app.use(routes);

module.exports = app;
