'use strict';

const { expect } = require('chai');
const iotaHelper = require('./iota-helper');

describe('@iota-supply-tracer/iota-helper', () => {
    describe('generateSeed', () => {
        it('should generate seed', () => {
            const seed = iotaHelper.generateSeed();
            expect(seed).to.have.lengthOf(81);
            expect(seed.includes('0')).to.be.false;
            expect(seed.includes('1')).to.be.false;
        })
        it('should generate different seeds', () => {
            const seed1 = iotaHelper.generateSeed();
            const seed2 = iotaHelper.generateSeed();
            expect(seed1).to.be.not.equal(seed2);
        })
    })
    describe('readTransaction', () => {
        it('should read transaction', async () => {
            const hash = 'YCFMHFNIGGDLSDYDVGLXM9V9VUHNRRHNXNLVHUFBLRYDITZAGSCNDSTJAFYBQCBLSMWPRFEVKSRJQV999';
            let transaction = await iotaHelper.readTransaction(hash);
            expect(transaction).to.be.an('object');
            expect(transaction.message.message).to.be.equal('Hello world from danipisca');
        })
    })
    describe('verifyTransaction', () => {
        it('should return verified', async () => {
            const hash = 'YCFMHFNIGGDLSDYDVGLXM9V9VUHNRRHNXNLVHUFBLRYDITZAGSCNDSTJAFYBQCBLSMWPRFEVKSRJQV999';
            let verified = await iotaHelper.verifyTransaction(hash);
            expect(verified).to.be.true;
        })
    })
});