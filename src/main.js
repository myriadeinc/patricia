const PROTO_PATH = './src/patricia.proto';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const s = require('grpc-node-server-reflection');
// import wrapServerWithReflection from '';
const serverurl = '0.0.0.0:8088';

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
  callback(null, 
    {
        block_status : 1,
        test: "hi there"
    });
}

function main() {
  let server = s.default(new grpc.Server());
  server.addService(patricia_proto.Patricia.service, {processBlock: processBlock});
  server.bind(serverurl, grpc.ServerCredentials.createInsecure());
  server.start();
  console.log(serverurl)
}



main();
