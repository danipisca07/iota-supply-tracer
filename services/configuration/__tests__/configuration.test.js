'use strict';

const { expect } = require('chai');
const Configuration = require('..');

describe('@iota-supply-tracer/configuration', () => {
    it('should return seed', () => {
        const seed = Configuration.seed;
        console.log("Seed:" + seed);
        expect(seed).to.have.lengthOf(81);
    });
});
