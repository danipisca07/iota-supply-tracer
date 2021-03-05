'use strict';

const IotaClient = require('@iota-supply-tracer/iota-client');

class User {
    constructor() {
        
    }

    async getProductData(product){
        return new Promise(async (resolve, reject) => {
            try {
                const client = new IotaClient(product.seed);
                const chain = await client.getSupplyChain();
                resolve(chain);
            } catch(e) {
                reject(e);
            }
        });
    }

    async verifyProduct(product){
        return new Promise(async (resolve, reject) => {
            try {
                //TODO
                resolve(true);
            } catch(e) {
                reject(e);
            }
        });
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

