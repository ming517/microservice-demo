import redis from './redis';

let client;

exports.init = () => {
  client = redis;
};

exports.publish = (channel, data) => {
  client.publish(channel, data);
};

exports.subscribe = (channel, callback) => {
  client.subscribe(channel, callback);
};

exports.unsubscribe = (channel) => {
  client.unsubscribe(channel);
};
