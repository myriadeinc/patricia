const axios = require('axios')
const logger = require('pino')()

const node_urls = [
    "https://node.monerod.org/json_rpc"
]



const SubmitService = {
    SubmitBlock: async (blockAsHex) => {
    payload = {
        "jsonrpc":"2.0",
        "id":"1",
        "method":"submit_block",
        "params":[blockAsHex]
    }
    for (const url of node_urls){
        try {
            const response = await axios.post(url, payload)
            logger.debug(response.data)
            if(response.data.result) {
                logger.info("got a status")
                return
            }
        } catch(e) {
            logger.error(e)
        }
    }
    logger.error("could not submit to any nodes")


    }
}


module.exports = SubmitService