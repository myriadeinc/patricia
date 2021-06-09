const PROTO_PATH = './src/patricia.proto';

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const s = require('grpc-node-server-reflection');
const serverurl = '0.0.0.0:8088';
const br = require('block.reference.js')
let packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
let patricia_proto = grpc.loadPackageDefinition(packageDefinition).patricia;


function processBlock(call, callback) {
  // Check protobuf params
  const pblock = call.request;
  // let block = br.buildBlock(
  //   pblock.hex_blob,
  //   pblock.hex_nonce,
  //   pblock.extra_nonce);
  // block = br.convertBlock()
  // block = br.hashBlock()
  const result = br.checkDifficulty(
    pblock.local_diff,
    pblock.global_diff,
    pblock.hex_result
  );
  callback(null, 
    {
        block_status : result,
        test: "something"
    });
}
async function main() {
  // let server = s.default(new grpc.Server());
  let server = new grpc.Server();
  server.addService(patricia_proto.Patricia.service, {processBlock: processBlock});
  server.bindAsync(
    serverurl, 
    grpc.ServerCredentials.createInsecure(),
    // Callback function, no params
    () => {
      server.start() 
      console.log(`Server started on ${serverurl}`)

    
    }
    );
  
}



main().catch(err=>console.log(err));
