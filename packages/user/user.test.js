'use strict';

const User = require('./user');
const { expect } = require('chai');
const iotaHelper = require('@iota-supply-tracer/iota-helper');
describe('@iota-supply-tracer/user', () => {
    describe('getSupplyChain', () => {
        it('should get chain', async () => {
            const exampleProduct = 'LXEVAFRTN9F9CANJMPZYGEVXNLBWMTV9DKYWFGCTRJHRZCAXFDZNAMKHQMSCAEBPXATZRMRBDDEYFYIRV';
            const user = new User();
            let supplyChain = await user.getSupplyChain({seed: exampleProduct});
            expect(supplyChain).to.be.an('array');
        })
    })
    describe('verifyChain', () => {
        it('should verify chain', async () => {
            const exampleProduct = 'LXEVAFRTN9F9CANJMPZYGEVXNLBWMTV9DKYWFGCTRJHRZCAXFDZNAMKHQMSCAEBPXATZRMRBDDEYFYIRV';
            const user = new User();
            let chain = await user.getSupplyChain({seed: exampleProduct});
            let verified = await user.verifyChain(chain);
            expect(verified).to.be.true;
        })
    })
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
