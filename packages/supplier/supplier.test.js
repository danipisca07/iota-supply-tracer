'use strict';

const Supplier = require('./supplier');
const { expect } = require('chai');
const iotaHelper = require('@iota-supply-tracer/iota-helper');
describe('@iota-supply-tracer/supplier', () => {
    describe('newProduct', () => {
        it('should generate new product', async () => {
            const supplier = new Supplier();
            let prod = await supplier.newProduct();
            expect(prod).to.be.not.null;
            let transaction = await iotaHelper.readTransaction(prod.transactionHash);
            expect(transaction.message.id).to.be.equal(prod.id);
        })
    })
    describe('transferProduct', () => {
        it('should transfer product', async () => {
            const supplier = new Supplier();
            let prod = await supplier.newProduct();
            const newOwnerCert = {subject: "whatever"};
            let hash = await supplier.transferProduct(prod, newOwnerCert);
            let transaction = await iotaHelper.readTransaction(hash);
            expect(transaction.message.newOwnerCertificate).to.deep.equal(newOwnerCert);
        })
    })
    describe('transferProductToEndUser', () => {
        it('should transfer product to end user', async () => {
            const supplier = new Supplier();
            let prod = await supplier.newProduct();
            let hash = await supplier.transferProductToEndUser(prod);
            let transaction = await iotaHelper.readTransaction(hash);
            expect(transaction.message.delivered).to.be.true;
            expect(transaction.message.confirmed).to.be.false;
        })
    })
});
