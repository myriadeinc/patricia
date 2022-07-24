'use strict';

const redis = require('redis');

const _ = require('lodash');


let redisClient;

const Cache = {

  init: (conf) => {
    redisClient = redis.createClient(conf);
    redisClient.connect()
  },

  parse: (rawString) => {
    let val = rawString;
    try {
      val = JSON.parse(val);
    } catch (err) {}
    return val;
  },

  stringify: (value) => {
    let val = value;
    if (!_.isString(val)) {
      val = JSON.stringify(val);
    }
    return val;
  },

  put: async (key, value, namespace='') => {
    const prefixed_key = `${namespace}::${key}`;
    // Set deafult ttl of 2 hours
    return redisClient.set(prefixed_key, Cache.stringify(value), {
      EX: 7200,
    });
  },

  get: async (key, namespace='') => {
    const prefixed_key = `${namespace}::${key}`;
    return redisClient.get(prefixed_key)
        .then((res) => {
          return Cache.parse(res);
        });
  },
  close: () => {
    redisClient.quit();
  },
};

module.exports = Cache;
