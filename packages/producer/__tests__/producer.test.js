'use strict';

const Producer = require('..');
const { expect } = require('chai');
const iotaHelper = require('@iota-supply-tracer/iota-helper');

describe('@iota-supply-tracer/producer', () => {
    describe('newProduct', () => {
        it('should generate new product', async () => {
            const producer = new Producer();
            let prod = await producer.newProduct();
            expect(prod).to.be.not.null;
            let transaction = await iotaHelper.readTransaction(prod.transactionHash);
            expect(transaction.message.id).to.be.equal(prod.id);
        })
    })
});
