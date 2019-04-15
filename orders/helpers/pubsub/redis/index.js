import redis from 'redis';
import debugLib from 'debug';

const debug = debugLib('orders:redis');

let pub;
let sub;

const subscribers = [];

function getPub() {
  if (pub) {
    return pub;
  }

  pub = redis.createClient(
    process.env.REDIS_PORT || 6379,
    process.env.REDIS_HOST || '127.0.0.1',
  );

  pub.on('connect', () => debug('Redis publisher connected'));
  pub.on('error', (err) => {
    debug(err);
  });
  pub.on('message', dispatch); // eslint-disable-line no-use-before-define

  return pub;
}

function getSub() {
  if (sub) {
    return sub;
  }

  sub = redis.createClient(
    process.env.REDIS_PORT || 6379,
    process.env.REDIS_HOST || '127.0.0.1',
  );

  sub.on('connect', () => debug('Redis subscriber connected'));
  sub.on('error', (err) => {
    debug(err);
  });
  sub.on('message', dispatch); // eslint-disable-line no-use-before-define

  return sub;
}

exports.publish = (channel, data) => {
  let dataToDispatch = data;
  if (typeof dataToDispatch === 'object') {
    dataToDispatch = JSON.stringify(dataToDispatch);
  }
  getPub().publish(channel, dataToDispatch);
};

exports.subscribe = (channel, callback) => {
  if (!subscribers[channel]) {
    getSub().subscribe(channel);
    subscribers[channel] = [callback];
  }
};

exports.unsubscribe = (channel) => {
  if (subscribers[channel]) {
    getSub().unsubscribe(channel);
    delete subscribers[channel];
  }
};

function dispatch(channel, message) {
  if (subscribers[channel]) {
    let messageToDispatch = message;
    try {
      messageToDispatch = JSON.parse(messageToDispatch);
    } catch (e) {
      // do nothing
    }
    subscribers[channel].forEach(cb => cb(messageToDispatch));
  }
}
