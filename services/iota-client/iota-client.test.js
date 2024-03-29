'use strict';
const { expect } = require('chai');
const IotaClient = require('./iota-client');
const iotaHelper = require('@iota-supply-tracer/iota-helper');

describe('@iota-supply-tracer/iota-client', () => {
    describe('getSeed', () => {
        it('should use seed', () => {
            let seed = iotaHelper.generateSeed();
            let client = new IotaClient(seed);
            expect(client.getSeed()).to.be.equal(seed);
        })
    })
    describe('generateAddress', () => {
        it('should generate address', async () => {
            let client = new IotaClient(iotaHelper.generateSeed());
            let address = await client.generateAddress();
            expect(address).to.be.not.null;
        })
    })
    describe('getAccountData', () => {
        it('should get Data', async () => {
            let client = new IotaClient(iotaHelper.generateSeed());
            let data = await client.getAccountData();
            expect(data).to.be.not.null;
            expect(data.balance).to.be.not.null;
            expect(data.addresses).to.be.an('array');
            expect(data.transactions).to.be.an('array');
        })
    })

    describe('newTransaction', () => {
        it('should create transaction', async () => {
            let client = new IotaClient(iotaHelper.generateSeed());
            let address = 'HEQLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWOR99DMNFAQLWHD';
            let hash = await client.newTransaction(address, 0, { data: "payload test"});
            expect(hash).to.be.not.null;
            let transaction = await iotaHelper.readTransaction(hash);
            expect(transaction.message.data).to.be.equal("payload test");
        })
    })

 
});
