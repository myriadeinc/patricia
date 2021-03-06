'use strict';
const amq = require('amqplib');
const debug = true;
const queue = 'Miner::Metrics';
const logger = require('pino')()

let channel;

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
} 

const toBuffer = (obj) => {
  let str = obj;
  if ('string' !== typeof myVar) {
    str = JSON.stringify(obj);
  }
  const buff = Buffer.from(str, 'utf8');
  return buff;
};

const MQ = {
  channel,
  init: async (url) => {
    await delay(3000)
    try {
      const conn = await amq.connect(url)
      const ch = await conn.createChannel()
      MQ.channel = ch
      logger.info("Messaging Queue Initialized!")
      return true
    } catch (e){
      logger.error("Could not connect to RabbitMQ!")
      logger.error(e);
      await MQ.init(url)
    }

  },

  send: (msg) => {
    return MQ.channel.assertQueue(queue)
      .then(ok => {
        if (debug) {
          logger.debug(`Sending data \n on queue ${queue} :`);
          logger.debug(msg);
        }
        return MQ.channel.sendToQueue(queue, toBuffer(msg));
      })
      .then(() => {
        return 0;
      })
      .catch((err) => {
        logger.error(err);
        logger.error(`Error occured while sending: \n ${msg}`);
        return -1;
      });
  },
  close: () => {

    return MQ.channel.close.then(() => { return amq.close(); });
  }
};

module.exports = MQ;
