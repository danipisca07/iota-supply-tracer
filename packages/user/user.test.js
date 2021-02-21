'use strict';

const User = require('./user');
const { expect } = require('chai');
const iotaHelper = require('@iota-supply-tracer/iota-helper');
describe('@iota-supply-tracer/user', () => {
    describe('confirmProduct', () => {
        it('should confirm reception of product', async () => {
            const user = new User();
            let mockProd = {
                id: "randomIdOfProductReceived",
                seed: iotaHelper.generateSeed()
            }
            let hash = await user.confirmProduct(mockProd);
            let transaction = await iotaHelper.readTransaction(hash);
            expect(transaction.message.id).to.be.equal(mockProd.id);
            expect(transaction.message.confirmed).to.be.true;
        })
    })
});
