
const config = require('./util/config.js');
const WebSocketRPCServer = require('rpc-websockets').Server
const logger = require('pino')()
const cache = require('./util/cache.js')
const mq = require('./util/mq.js')
const service = require('./stratum.service.js')
const xmrapi = require('./xmr.api.js')

function debugDump() {
	logger.info(`REDIS_URL = ${config.get('REDIS_URL')}`)
	logger.info(`RABBITMQ_URL = ${config.get('RABBITMQ_URL')}`)
}

async function main() {
debugDump()
  
const server = new WebSocketRPCServer({
  port: 9877,
  host: '0.0.0.0'
})

await cache.init({url: config.get('REDIS_URL')})

await mq.init(config.get('RABBITMQ_URL'));

// submitjob
server.register('newtemplatejob', service.NewJobWithTemplate)
server.register('submitjob', service.SubmitJob)
server.register('ack', service.Ack)

logger.info(`Websocket server started on 9877`)
}



main().catch(err => logger.error(err));
