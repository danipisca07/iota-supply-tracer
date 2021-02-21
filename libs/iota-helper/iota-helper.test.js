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

const messageHash = '608e5ffb0603795674dbffc77546f11775bec5dead0d4b8f3ec918e0c13d5d6f';

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
    describe('readMessage', () => {
        it('should read Message', async () => {
            let message = await iotaHelper.readMessage(messageHash);
            expect(message).to.be.an('object');
            expect(message.payload.data).to.be.equal('Hello World from danipisca!');
        })
    })
    // describe('confirmTransaction', () => {
    //     it('should return true', async () => {
    //         let confirmed = await iotaHelper.confirmTransaction(messageHash);
    //         expect(confirmed).to.be.true;
    //     })
        // it('should return false', async () => {
        //     let trytes = await iotaHelper.api.prepareTransfers(iotaHelper.generateSeed(), transfers);
        //     let hash = (await iotaHelper.api.sendTrytes(trytes, 3, 9))[0].hash;
        //     let confirmed = await iotaHelper.confirmTransaction(hash);
        //     expect(confirmed).to.be.false;
        // })
    // })
    // describe('waitUntilConfirmed', () => {
    //     it('should timeout to false before confirmation', async () => {
    //         let trytes = await iotaHelper.api.prepareTransfers(iotaHelper.generateSeed(), transfers);
    //         let hash = (await iotaHelper.api.sendTrytes(trytes, 3, 9))[0].hash;
    //         expect(iotaHelper.waitUntilConfirmed(hash, 50, 5)).to.eventually.be.rejected;
    //     })
    //     it('should eventually be confirmed', async () => {
    //         let trytes = await iotaHelper.api.prepareTransfers(iotaHelper.generateSeed(), transfers);
    //         let hash = (await iotaHelper.api.sendTrytes(trytes, 3, 9))[0].hash;
    //         let time = await iotaHelper.waitUntilConfirmed(hash);
    //         expect(time).to.be.not.null;
    //     })
    // })
});