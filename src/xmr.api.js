const axios = require('axios')
const logger = require('pino')()
const cache = require('./util/cache.js')
const node_urls = [
    "https://node.monerod.org/json_rpc"
]
const reserveOffset = 8;
const poolAddress = "42PooLTYHzzZPY15hZt5SJVRCLYZCLYPdMhRjXaUY3SwERq9yxCnKg1EnGd1YqTR9GfH1EK4LfquBbRPuWKtPku6M6qhyZg"

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
} 

const MoneroService = {
    send_rpc: async (payload) => {
        for (const url of node_urls){
            try {
                const response = await axios.post(url, payload)
                logger.debug(response.data)
                if(response.data.result) {
                    logger.debug(`got a response from ${url}`)
                    return response.data.result
                }
            } catch(e) {
                logger.error(e)
            }
        }
    },


    SubmitBlock: async (blockAsHex) => {
    payload = {
        "jsonrpc":"2.0",
        "id":"1",
        "method":"submit_block",
        "params":[blockAsHex]
    }
    const status = await MoneroService.send_rpc(payload)
    if (status) {
        return
    }
    logger.error("could not submit to any nodes")
    }
}


module.exports = MoneroService