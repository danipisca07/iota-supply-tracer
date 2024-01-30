'use strict';
const Iota = require('@iota/iota.js');
const Configuration = require('@iota-supply-tracer/configuration');
const { Converter } = require('@iota/iota.js');


const client = new Iota.SingleNodeClient(Configuration.provider);

const iotaHelper = {
    api: client,

    generate: (count, characters) => {
        let rnd = '';
        for (let i = 0; i < count; i++) {
            rnd += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return rnd;
    },

    generateSeed: () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9';
        return iotaHelper.generate(81, characters);
    },

    readMessage: async (hash) => {
        return new Promise((resolve, reject) => {
            iotaHelper.api.message(hash)
                .then(message => {
                    message.payload.data = Converter.hexToUtf8(message.payload.data);
                    message.payload.index = Converter.hexToUtf8(message.payload.index);
                    resolve(message);
                })
                .catch(err => {
                    reject(err);
                });
        })
    },

    // confirmTransaction: async (hash) => {
    //     return new Promise((resolve, reject) => {
    //         resolve(true); //TODO: to be implemented ???
    //     })
    // },

    // waitUntilConfirmed: async (hash, msTimeout = 0, msInterval = 1000) => {
    //     return new Promise((resolve, reject) => {
    //         let timeout, interval;
    //         const start = process.hrtime();
    //         if (msTimeout != 0) {
    //             timer = setTimeout(() => {
    //                 clearInterval(interval);
    //                 reject(new Error('waitUntilConfirmed: Timeout reached before confirmation'));
    //             }, timeout);
    //         }

    //         interval = setInterval(() => {
    //             iotaHelper.confirmTransaction(hash)
    //                 .then((confirmed) => {
    //                     if (confirmed) {
    //                         clearInterval(interval);
    //                         if(timeout !== null) clearTimeout(timeout);
    //                         const time = process.hrtime(start);
    //                         const seconds = time[0] + time[1] / 1000000000
    //                         resolve(seconds.toFixed(2));
    //                     }
    //                 })
    //                 .catch((err) => reject(err));
                
    //         }, msInterval)
    //     })
    // }


}

module.exports = iotaHelper;
