const PROTO_PATH = './src/protobufs/patricia.proto';

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
// const s = require('grpc-node-server-reflection');
const serverurl = '0.0.0.0:8088';
const blockReferenceService = require('block.reference.js');
let packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
let patricia_proto = grpc.loadPackageDefinition(packageDefinition).patricia;

async function main() {
  let server = new grpc.Server();
  server.addService(
    patricia_proto.Patricia.service, 
    { processBlock: blockReferenceService.processBlock });

  server.bindAsync(
    serverurl, 
    grpc.ServerCredentials.createInsecure(),
    // Callback function, no params
    () => {
      server.start() 
      console.log(`Server started on ${serverurl}`)
    });
  
}



main().catch(err=>console.log(err));
