'use strict';

const { expect } = require('chai');
const IotaClient = require('..');
const iotaHelper = require('@iota-supply-tracer/iota-helper');

describe('@iota-supply-tracer/iota-client', () => {
    describe('getSeed', () => {
        it('should generate seed', () => {
            let client = new IotaClient();
            let seed = client.getSeed();
            expect(seed).to.have.lengthOf(81);
        })
        it('should use seed', () => {
            let seed = iotaHelper.generateSeed();
            let client = new IotaClient(seed);
            expect(client.getSeed()).to.be.equal(seed);
        })
    })
    describe('generateAddress', () => {
        it('should generate address', async () => {
            let client = new IotaClient();
            let address = await client.generateAddress();
            expect(address).to.be.not.null;
        })
    })
});
