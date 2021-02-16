'use strict';

const iotaHelper = require('@iota-supply-tracer/iota-helper');
const IotaClient = require('@iota-supply-tracer/iota-client');

class Producer {
    constructor() {
        this.client = new IotaClient()
    }

    async newProduct() {
        return new Promise(async (resolve, reject) => {
            let product = {};
            product.seed = iotaHelper.generateSeed();
            product.client = new IotaClient(product.seed);
            product.address = await product.client.generateAddress();
            product.id = iotaHelper.generate(5, '0123456789'); //TODO: receive Id as param
            const payload = {
                id: product.id
            };
            this.client.newTransaction(product.address, 0, payload)
                .then((hash) => {
                    product.transactionHash = hash;
                    resolve(product)
                })
                .catch((err) => reject(err))
        })
    }
}

module.exports = Producer;


