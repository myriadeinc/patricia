const crypto = require('crypto');
const logger = require('pino')()

const xmrlib = require('./util/xmr.js')

const cache = require('./util/cache.js')
const mq = require('./util/mq.js')

const BlockReferenceService = require('./block.reference.js')
const SubmitService = require('./xmr.submit.js')

const minDiff = BigInt(100000);
const nRandomBytesJob = 21
const nRandomBytesNonce = 4
const reserveOffset = 8


const StratumService = {
  NewJob: async (params) => {
    try {

      const {
        miner
    } = params[0]

    template = await cache.get('blocktemplate')

    const extraNonce = StratumService.getExtraNonce()
    const diff = minDiff;

    
    // We create a job as reference, then send a processed reply as the actual job
    const newJob = {
      miner: miner,
      job_id: crypto.pseudoRandomBytes(nRandomBytesJob).toString('hex'),
      extraNonce: extraNonce,

      height: template.height,
      seed_hash: template.seed_hash,
      blocktemplate_blob: template.blocktemplate_blob,
      globalDiff: template.difficulty.toString(),

      // Cannot use BigInt in Redis!
      difficulty: diff.toString()
    }

    await cache.put(newJob.job_id, newJob)

    const minerJob = StratumService.createMinerJob(newJob)
    logger.child({height: newJob.height}).debug("returning minerjob")
    return minerJob


    } catch(e) {
      console.error(e)
      return {}

    }
   

  },
  createMinerJob: (newJob) => {
    const blob = Buffer.from(newJob.blocktemplate_blob, "hex")
    blob.writeUInt32BE(newJob.extraNonce, reserveOffset);
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
      }
      isValidBlock = BlockReferenceService.verifyBlock(job.blocktemplate_blob, nonce, job.extraNonce, job.seed_hash, result)
      if (isValidBlock) {
        blockStatus = BlockReferenceService.checkDifficulty(job.difficulty, job.globalDiff, result)
        blockAsHex = BlockReferenceService.buildBlock(job.blocktemplate_blob, nonce, job.extraNonce).toString('hex')
        if (blockStatus == 3) {
            SubmitService.SubmitBlock(blockAsHex)
        }
        if (blockStatus > 1) {
          StratumService.sendShareSapphire(job)
          return {accepted: true}
        }
        
      }
      return {accepted: false}
  
    } catch(e) {
      console.error(e)
      return {}
    }
   
  }

}

module.exports = StratumService