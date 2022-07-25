const axios = require('axios')

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
            console.dir(response.data)
            if(response.data.result) {
                console.log("got status")
                return
            }
        } catch(e) {
            console.error(e)
        }
    }
    console.error("could not submit to any nodes")


    }
}


module.exports = SubmitService