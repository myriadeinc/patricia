'use strict';

const config = require('nconf')
  .argv()
  .env({separator: '__'})
;

const Config = {

  get: config.get.bind(config),

  environment: process.env.NODE_ENV,

  isProduction: () => {
    return Config.environment === 'production';
  },
};

module.exports = Config;
