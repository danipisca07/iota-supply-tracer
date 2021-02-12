'use strict';

const { expect } = require('chai');
const iotaHelper = require('..');

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
});