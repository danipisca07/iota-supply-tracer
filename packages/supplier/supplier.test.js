'use strict';

const Supplier = require('./supplier');
const { expect } = require('chai');
const iotaHelper = require('@iota-supply-tracer/iota-helper');
describe('@iota-supply-tracer/supplier', () => {
    const supplier = new Supplier();
    describe('generateNewKey', () => {
        it('should generate new keypair', async () => {
            await supplier.newKeyPromise;
            expect(supplier._privateKey).to.be.not.null;
            expect(supplier.certificate.publicKey).to.be.not.null;
        })
    }),
    describe('newProduct', () => {
        it('should generate new product', async () => {
            let prod = await supplier.newProduct();
            expect(prod).to.be.not.null;
            let transaction = await iotaHelper.readTransaction(prod.transactionHash);
            expect(transaction.message.id).to.be.equal(prod.id);
        })
    })
    describe('transferProduct', () => {
        it('should transfer product', async () => {
            let prod = await supplier.newProduct();
            const newEntity = 'ZCRDEWLK9WFOFSHXRYU9PDHAFOQHJKJPEVRGEDHMMJGUQDKHNAYJ9CUFFFXKJHCLQJDAGZXJTLPMPYCGA'
            let hash = await supplier.transferProduct(prod, newEntity);
            let transaction = await iotaHelper.readTransaction(hash);
            expect(transaction.message.newEntity).to.be.equal(newEntity);
        })
    })
    describe('transferProductToEndUser', () => {
        it('should transfer product to end user', async () => {
            let prod = await supplier.newProduct();
            let hash = await supplier.transferProductToEndUser(prod);
            let transaction = await iotaHelper.readTransaction(hash);
            expect(transaction.message.delivered).to.be.true;
            expect(transaction.message.confirmed).to.be.false;
        })
    })
    describe('updateProduct', () => {
        it('should publish product update', async () => {
            let prod = await supplier.newProduct();
            let status = { phase: 'delivery', location: 'Italy'};
            let hash = await supplier.updateProduct(prod, status);
            let transaction = await iotaHelper.readTransaction(hash);
            expect(transaction.message.status.phase).to.be.equal('delivery');
            expect(transaction.message.status.location).to.be.equal('Italy');
        })
    })
});
