const Producer = require('./packages/producer/producer');
const Intermediary = require('./packages/intermediary/intermediary');
const User = require('./packages/user/user');
const iotaHelper = require('./libs/iota-helper/iota-helper');

async function main() {

    //Product creation
    const producer = new Producer(iotaHelper.generateSeed());
    const product = await producer.newProduct();
    await iotaHelper.waitUntilConfirmed(product.transactionHash);
    console.log(`New product with id: ${product.id} registered on the tangle with transaction: ${product.transactionHash}`);

    //Transfer to intermediary
    const intermediary = new Intermediary();
    const intermediaryCert = intermediary.certificate;
    const transactionHash = await producer.transferProduct(product, intermediaryCert);
    await iotaHelper.waitUntilConfirmed(transactionHash);
    console.log(`Product with id: ${product.id} is now under custody of intermediary. [${transactionHash}]`);

    //Transfer to end user
    transactionHash = await intermediary.transferProductToEndUser(product);
    await iotaHelper.waitUntilConfirmed(transactionHash);
    console.log(`Product with id: ${product.id} delivered to end user. [${transactionHash}]`);

    //Product confirmation
    const user = new User();
    transactionHash = user.confirmProduct(product);
    await iotaHelper.waitUntilConfirmed(transactionHash);
    console.log(`Product with id: ${product.id} is confirmed by end user. [${transactionHash}]`);

}

main();