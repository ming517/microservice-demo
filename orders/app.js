import express from 'express';
import logger from 'morgan';

import pubsub from './helpers/pubsub';
import routes from './routes';

require('dotenv').config();

const app = express();

pubsub.init();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', routes);

module.exports = app;
