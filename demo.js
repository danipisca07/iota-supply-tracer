const Supplier = require('./packages/supplier/supplier');
const User = require('./packages/user/user');
const iotaHelper = require('./libs/iota-helper/iota-helper');

async function main() {

    //Product creation
    const supplier = new Supplier(iotaHelper.generateSeed());
    await supplier.newKeyPromise;
    const product = await supplier.newProduct();
    await iotaHelper.waitUntilConfirmed(product.transactionHash);
    console.log(`New product with id: ${product.id} registered [${product.transactionHash}]`);

    //Transfer to intermediary
    const intermediary = new Supplier();
    await intermediary.newKeyPromise;
    const intermediaryCert = intermediary.certificate;
    let transactionHash = await supplier.transferProduct(product, intermediaryCert);
    await iotaHelper.waitUntilConfirmed(transactionHash);
    console.log(`Product with id: ${product.id} is now under custody of intermediary [${transactionHash}]`);

    //Transfer to end user
    transactionHash = await intermediary.transferProductToEndUser(product);
    await iotaHelper.waitUntilConfirmed(transactionHash);
    console.log(`Product with id: ${product.id} delivered to end user [${transactionHash}]`);

    //Product confirmation
    const user = new User();
    transactionHash = await user.confirmProduct(product);
    await iotaHelper.waitUntilConfirmed(transactionHash);
    console.log(`Product with id: ${product.id} is confirmed by end user [${transactionHash}]`);

}

main();