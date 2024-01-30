'use strict';

const IotaClient = require('@iota-supply-tracer/iota-client');

class User {
    constructor() {
        
    }

    async confirmProduct(product) {
        const client = new IotaClient(product.seed);
        const payload = {
            id: product.id,
            delivered: true,
            confirmed: true,
        };
        let addr = await client.generateAddress();
        const hash = await client.newTransaction(addr, 0, payload);
        return hash;
    }
}

module.exports = User;

