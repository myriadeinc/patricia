const crypto = require('crypto');
const logger = require('pino')()
const _ = require('lodash')

const xmrlib = require('./util/xmr.js')

const cache = require('./util/cache.js')
const mq = require('./util/mq.js')

const BlockReferenceService = require('./block.reference.js')
const xmrapi = require('./xmr.api.js')

const minDiff = BigInt(100000);
const nRandomBytesJob = 21
const nRandomBytesNonce = 4
const reserveOffset = 8


const StratumService = {
  Ack: async () => {
    return {'ack': true}
  },

  NewJobWithTemplate: async (params) => {
    try {

      let {
        miner,
        templateHeight, // string
        templateBlob, // string
        templateDiff, // string
        templateSeedhash, // string
    } = params[0]

    const fieldsPresent = [templateHeight,templateBlob,templateDiff,templateSeedhash].filter(f => _.isNil(f)).length == 0;

    if (!fieldsPresent){
      logger.child({calldata: params[0]}).info("not all fields present")
      return {}
    }
    if (_.isNil(miner)){
      miner = "00001111-1111-4222-8333-abc123456789";
    }

    const extraNonce = StratumService.getExtraNonce()
  
    // We create a job as reference, then send a processed reply as the actual job
    const newJob = {
      "miner": miner,
      "job_id": crypto.pseudoRandomBytes(nRandomBytesJob).toString('hex'),
      "extraNonce": extraNonce,

      "height": templateHeight,
      "seed_hash": templateSeedhash,
      "blocktemplate_blob": templateBlob,
      "globalDiff": templateDiff,

      // Cannot use BigInt in Redis!
      "difficulty": minDiff.toString()
    }

    await cache.put(newJob.job_id, newJob)

    const minerJob = StratumService.createMinerJob(newJob)
    logger.child({height: newJob.height}).debug("returning minerjob")
    return minerJob


    } catch(e) {
      logger.error(e)
      return {}

    }
   

  },
  createMinerJob: (newJob) => {
    const blob = Buffer.from(newJob["blocktemplate_blob"], "hex")
    blob.writeUInt32BE(newJob["extraNonce"], reserveOffset);
    const minerBlob = xmrlib.convert_blob(blob).toString("hex")

    return {
      id: newJob.miner,
      job_id: newJob.job_id,

      height: newJob.height.toString(),
      target: newJob.difficulty.toString(),
      seed_hash: newJob.seed_hash,


      blob: minerBlob,
      algo: "rx/0"
    }
  },
  getExtraNonce: () => {
    // Randomly generated for now, should later be based on uuid + deterministic factors
    return crypto.pseudoRandomBytes(nRandomBytesNonce).readUInt32BE(0, true);
  },
  sendShareSapphire: (job) => {
    const sapphirePayload = {
      minerId: job.miner,
      shares: 1, // We can modify this later for 'mining boosts'
      difficulty: job.difficulty,
      timestamp: Date.now(),
      blockHeight: job.height
    }
    mq.send(sapphirePayload)
  },

// "params":{
// 	"id":"3220921a94dd7ebacc85bdbf508b23e6545c80fb81",
// 	"job_id":"3220921a94dd7ebacc85bdbf508b23e6545c80fb81",
// 	"nonce":"f1830100",
// 	"result":"c68384ce77a3f4b1ffacd7e94b42f7da827e46fd3e8dfba3caa5eacf6cca6a01"
// }
  SubmitJob: async (params) => {
    try {
      const {
        job_id,
        nonce,
        result
      } = params[0]
      job = await cache.get(job_id)
      if (job){
        logger.debug("job fetch valid")
        try {
          StratumService.sendShareSapphire(job)
        } catch(e){
          logger.error(e)
          logger.error("could not send share to sapphire")
        }
      }
      const blob = _.get(job, "blocktemplate_blob", null)
      const enonce = _.get(job, "extraNonce", null)
      const seed_hash = _.get(job, "seed_hash", null)
      const difficulty = _.get(job, "difficulty", null)
      const globalDiff = _.get(job, "globalDiff", null)
      const jobheight = _.get(job, "height", null)

      const fieldsPresent = [blob,enonce,seed_hash,difficulty,globalDiff,jobheight].filter(f => _.isNil(f)).length == 0;

      if (!fieldsPresent){
        logger.child({jobdata: job}).info("not all fields in job present")
        return {accepted: false}
      }

      isValidBlock = BlockReferenceService.verifyBlock(blob, nonce, enonce, seed_hash, result)
      if (isValidBlock) {
        blockStatus = BlockReferenceService.checkDifficulty(difficulty, globalDiff, result)
        blockAsHex = BlockReferenceService.buildBlock(blob, nonce, enonce).toString('hex')
        if (blockStatus == 3) {
          logger.info(`winner winner chicken dinner ${jobheight}`)
          await xmrapi.SubmitBlock(blockAsHex)
        }
        if (blockStatus > 1) {
          StratumService.sendShareSapphire(job)
          return {accepted: true}
        }
        
      }
      return {accepted: false}
  
    } catch(e) {
      console.error(e)
      logger.error(e)
      return {}
    }
   
  },




}

module.exports = StratumService