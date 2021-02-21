'use strict';

const IotaClient = require('@iota-supply-tracer/iota-client');

class User {
    constructor() {
        
    }

    async confirmProduct(product) {
        return new Promise(async (resolve, reject) => {
            const client = new IotaClient(product.seed);
            const payload = {
                id : product.id,
                delivered: true,
                confirmed : true,
            };
            let addr = await client.generateAddress();
            client.newTransaction(addr, 0, payload)
                .then((hash)=> {
                    resolve(hash);
                })
                .catch((err) => {
                    reject(err);
                })
        });
    }
}

module.exports = User;

