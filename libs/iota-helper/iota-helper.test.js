'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const iotaHelper = require('./iota-helper');

const transfers =[{
    value: 0,
    address: 'HEQLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWOR99DMNFAQLWHD',
    message: null
}];

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
    describe('confirmTransaction', () => {
        it('should return true', async () => {
            const hash = 'YCFMHFNIGGDLSDYDVGLXM9V9VUHNRRHNXNLVHUFBLRYDITZAGSCNDSTJAFYBQCBLSMWPRFEVKSRJQV999';
            let confirmed = await iotaHelper.confirmTransaction(hash);
            expect(confirmed).to.be.true;
        })
        it('should return false', async () => {
            let trytes = await iotaHelper.api.prepareTransfers(iotaHelper.generateSeed(), transfers);
            let hash = (await iotaHelper.api.sendTrytes(trytes, 3, 9))[0].hash;
            let confirmed = await iotaHelper.confirmTransaction(hash);
            expect(confirmed).to.be.false;
        })
    })

    describe('getEntityCertificate', () => {
        it('should return certificate', async () => {
            const entity = 'ZCRDEWLK9WFOFSHXRYU9PDHAFOQHJKJPEVRGEDHMMJGUQDKHNAYJ9CUFFFXKJHCLQJDAGZXJTLPMPYCGA';
            //const entity = 'WOTDVQTNXREFWYCJNAUTFGHBBETP9E9THMBGJTJV9MHQOWACNELYKLOTFADMKRMETCXEWTSGDIIEGEDNKSWTKJRTLW';
            let certificate = await iotaHelper.getEntityCertificate(entity);
            expect(certificate.name).to.be.equal('Producer');
        })
    })

    describe('waitUntilConfirmed', () => {
        it('should timeout to false before confirmation', async () => {
            let trytes = await iotaHelper.api.prepareTransfers(iotaHelper.generateSeed(), transfers);
            let hash = (await iotaHelper.api.sendTrytes(trytes, 3, 9))[0].hash;
            expect(iotaHelper.waitUntilConfirmed(hash, 50, 5)).to.eventually.be.rejected;
        })
        it('should eventually be confirmed', async () => {
            let trytes = await iotaHelper.api.prepareTransfers(iotaHelper.generateSeed(), transfers);
            let hash = (await iotaHelper.api.sendTrytes(trytes, 3, 9))[0].hash;
            let time = await iotaHelper.waitUntilConfirmed(hash);
            expect(time).to.be.not.null;
        })
    })
    
});