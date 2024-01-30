'use strict';

const User = require('./user');
const { expect } = require('chai');
const IotaClient = require('@iota-supply-tracer/iota-client');
describe('@iota-supply-tracer/user', () => {
    describe('confirmProduct', () => {
        it('should confirm reception of product', async () => {
            const user = new User();
            let mockProd = {
                id: "randomIdOfProductReceived",
                seed: IotaClient.generateSeed()
            }
            let hash = await user.confirmProduct(mockProd);
            let transaction = await IotaClient.readTransaction(hash);
            expect(transaction.message.id).to.be.equal(mockProd.id);
            expect(transaction.message.confirmed).to.be.true;
        })
    })
});
