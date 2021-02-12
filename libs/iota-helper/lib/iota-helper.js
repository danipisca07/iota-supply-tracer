'use strict';

const iotaHelper = {
    generateSeed: () => {
        var seed = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9';
        var charactersLength = characters.length;
        for (var i = 0; i < 81; i++) {
            seed += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return seed;
    }
}

module.exports = iotaHelper;
