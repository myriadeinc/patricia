'use strict';

const redis = require('redis');

const _ = require('lodash');


let redisClient;

const Cache = {

  init: (conf) => {
    redisClient = redis.createClient(conf);
    return redisClient.connect()
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
    if (_.isString(val)) {
      return val;
    }
    return JSON.stringify(val);
  },

  put: async (key, value, timeout = 7200) => {
    // Set deafult ttl of 2 hours
    return redisClient.set(key, Cache.stringify(value), {
      EX: timeout,
    });
  },

  get: async (key) => {
    return redisClient.get(key)
        .then((res) => {
          return Cache.parse(res);
        });
  },
  close: () => {
    redisClient.quit();
  },
};

module.exports = Cache;
