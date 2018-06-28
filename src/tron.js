const { SolidityGrpcClient, GrpcClient } = require('tronix.js');
const fetch = require('node-fetch');

class TronRouter {
  constructor() {
    this.client = new GrpcClient({
      hostname: '47.254.146.147',
      port: 50051,
    });

    this.solidityClient = new SolidityGrpcClient({
      hostname: '18.204.117.182',
      port: 50051,
    });

    // read methods available
    this.methods = [
      ...Object.getOwnPropertyNames(GrpcClient.prototype),
      ...Object.getOwnPropertyNames(SolidityGrpcClient.prototype)
    ].filter(prop => prop !== 'constructor');
  }

  isRoute(path) {
    return this.methods.includes(path);
  }

  execRequest(path) {
    if (this.client[path]) {
      return this.client[path]();
    } else if (this.solidityClient[path]) {
      return this.solidityClient[path]();
    }
  }
  
}

module.exports = TronRouter;
