'use strict';

const Producer = require('./producer');
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
    describe('transferProduct', () => {
        it('should transfer product', async () => {
            const producer = new Producer();
            let prod = await producer.newProduct();
            const newOwnerCert = {subject: "whatever"};
            let hash = await producer.transferProduct(prod, newOwnerCert);
            let transaction = await iotaHelper.readTransaction(hash);
            expect(transaction.message.newOwnerCertificate).to.deep.equal(newOwnerCert);
        })
    })
});
