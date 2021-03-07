'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(require('chai-as-promised'));
chai.use(sinonChai);

const Configuration = require('./services/configuration/configuration');
const Supplier = require('./packages/supplier/supplier');
const User = require('./packages/user/user');
const supplierConfig = {
    name: "Producer",
    website: "producer.it",
    certificate : {
        name: "Producer",
        website: "producer.it",
        entity: 'ZCRDEWLK9WFOFSHXRYU9PDHAFOQHJKJPEVRGEDHMMJGUQDKHNAYJ9CUFFFXKJHCLQJDAGZXJTLPMPYCGA',
        publicKey : `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAy6AZlX0vH0FBeO4xKr+V
L5LygwTZZuSorHTaLf1mkObYyxjz3FsqFDnL957E0sgmeIuufswvnb774efwXLlc
FWjwAVxwUpdC0rv5veqosryW/StTmYmXG5n9u3JNLqF7p6Vt7XEjlcxJ3p/uQ28r
AUB46sDIXhPKn3LLT0zGorGRjBK1jiLijCiEyXrGupxcvRdPBGM5EKFtE+I0R2Rd
PYTdWRS3+PuM8LkIg0nXzsbpsD3p5Ssn9XOCA5F4QGJYAD/DnddR1b1+zwHzbKsW
Pp5YNPK+eSbMVMd9SfpSu1Vl6/V+wtp0G83wUwigkkPSu/mWTPv2aUvzeCRfNpcN
mQIDAQAB
-----END PUBLIC KEY-----`
    },
    seed : 'BPCQLSZINFFVYLMUKHGBOXUEOXZERA9IVAN9FXM9JLKGYJIAVQNCTXLU9KGXDDPKVLLWUIXLRJATSF9YA',
    privateKey : `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDLoBmVfS8fQUF4
7jEqv5UvkvKDBNlm5KisdNot/WaQ5tjLGPPcWyoUOcv3nsTSyCZ4i65+zC+dvvvh
5/BcuVwVaPABXHBSl0LSu/m96qiyvJb9K1OZiZcbmf27ck0uoXunpW3tcSOVzEne
n+5DbysBQHjqwMheE8qfcstPTMaisZGMErWOIuKMKITJesa6nFy9F08EYzkQoW0T
4jRHZF09hN1ZFLf4+4zwuQiDSdfOxumwPenlKyf1c4IDkXhAYlgAP8Od11HVvX7P
AfNsqxY+nlg08r55JsxUx31J+lK7VWXr9X7C2nQbzfBTCKCSQ9K7+ZZM+/ZpS/N4
JF82lw2ZAgMBAAECggEAW0Tcksu0ll7KeOjSsuWCeft0pdNDmsH89Ke/r4N4OJSw
MYBytZ9LIhux18CbWhsKW1fIk97zrNIQ1nX+n6EZrCMICKQlWG+iLRDCZSTMDqlH
SBzmcNhiGaYRO7aE79TDtyYIOrhOifMyXQ30XtdyQDJkwFw+syRN2uA6TsYL9pmx
Igppnqc8a6L+QWO717oGF11x4lhMFtGH2fePaxCFQ0x3LxfBAAeFUa3+0JF2Dqnu
FoIdOQ54fFtdCqdF4oI/W1ouGxshy1M553iItZl+L60xyF3+YBqRjO8XvXjEgFhz
fekTXKQkYfj9XAUG/VpUyF8BDQC8B8yU3j/ANkxS8QKBgQD6m8cv7X80FPuIXmYj
jXBPeGYS/lGo/jRd8aYJTeweYgoEtNpuyVr8FMDCgxa082gP+p4ADBgZMgbRdQ/M
67/FWuSdn3nu28XU3sRDaOo4xEQ7HNDMOwv9fE/n/T+UK+ZloGLbR7Ahz4fauj5L
F7pCCshHUmbAkdm7p+kFmD3kFQKBgQDQAZAsEpr1DqnCEZifWLrzl0LiYlcfDCnP
JQdnkE7ARmw1sbx+il7wjkYX13+w6JmOXYqd2kMovnVZS1aNT0hvlKdUfC38uHmO
rBP1hgNclUuOR0X+SSWgTbzjClXBpPW1bCKq0k9TH/bI3u7kjnTx0ENYO+chSYcK
cfUaoHqQdQKBgQDXEadAn25CERvIbVL0geZ3nRjkhfMot3fTg5V9eK0Bahu07Exl
NVJq8Zh3la5//kA5Llg4LCjmPoORcAfuUgeS5C08hGdNMLi3tbHzM++GZhE0NceO
7cGdefjNXA4bKA2i+6C7FOu4KHUrphfds/A5yy0T4EikTMbx/+i/z2aV/QKBgBFP
b/4a9kZamAoMiNUJ/1TyS6CnanStAHW6sSkPO16I/cxiJDurrEb8sByf1IKWeOD+
K+EDHv+vCfkKagOMi4ytpFdFllYnzAXxkB+orXLxAb6vc8W7tKPolEWYwJZC8ifM
/f2VTwCt8k25L8xZhqXxHQmkwpFkmxZlcW5r2IdZAoGBAN6wTszAXhhSRAo/VsH7
4xZ2k8AhCLVGYlSN5UONKp5i6vQwoaNlbhHnoHJqfcqTbYCY6C1HxIZvyIjkpdft
xpboRKqfJ6MAmPf3PVdK5emuV+kbMnXaInZ0R45vxli6I2S0/+99L7GACTFYdrAn
9nS5giuwuq9+9VWSNVuyb1T0
-----END PRIVATE KEY-----`
};

const intermediaryConfig = {
    name: "intermediary",
    website: "intermediary.it",
    certificate: {
        name: "intermediary",
        website: "intermediary.it",
        entity: 'RVQJRYYSTXRUPISHGCJZDOFZEITQVXUWROPJCEY9QZCJGMETNKC9HAKZUORNRLHQPUMNPXS9UPHKCLQAA',
        publicKey: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6vWCIjyiiIKWoikxzTZ0
Suugubd7PQGIUg0STMt2SsNIf9Ez8lEf5ep/squYTnLFbpimqvhmsw8gfKjqC/fl
5hXxmZd1yDMPxqxTffzdqXW+0k//AFTkf6TrIT+lWDwvQIJ1M5YD1z8U2mHWMj1i
TTNT7CYywgcywBwB2vGhvlXQwDLXc0BoHYIFXtktTNNeGloGqw6APTbOABt/89v+
/smz2X6bNq1KjN7Kvagz5SBvR8FPXdzz+VRVCdueWjLcgKQN+0si3iKQ3BEdaBMg
t4I9EiJXHt5vM5EPh5/ohRJNiDnDHp3UcwQBK+Q8xtbu1aZ/2SCVagjUuyYiFgxT
/QIDAQAB
-----END PUBLIC KEY-----`
    },
    seed: 'WYHOOOAOUFSBBERHLMCYIPWGWFPKCDBICNYTENKAWJEDEXXMYMHKCSKDBDLSZIRC9Y9DTIRRR99SVBPCB',
    privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDq9YIiPKKIgpai
KTHNNnRK66C5t3s9AYhSDRJMy3ZKw0h/0TPyUR/l6n+yq5hOcsVumKaq+GazDyB8
qOoL9+XmFfGZl3XIMw/GrFN9/N2pdb7ST/8AVOR/pOshP6VYPC9AgnUzlgPXPxTa
YdYyPWJNM1PsJjLCBzLAHAHa8aG+VdDAMtdzQGgdggVe2S1M014aWgarDoA9Ns4A
G3/z2/7+ybPZfps2rUqM3sq9qDPlIG9HwU9d3PP5VFUJ255aMtyApA37SyLeIpDc
ER1oEyC3gj0SIlce3m8zkQ+Hn+iFEk2IOcMendRzBAEr5DzG1u7Vpn/ZIJVqCNS7
JiIWDFP9AgMBAAECggEAIl36xOs9kt4XDm0cHbojVHoWrlOKMSgyOl4zGQyBpvnd
duSwxnbbRZQBTa8PvhnHix/E8SkYTISf6dwDL/D4raj0B9VBoyDk49h89eawvYK9
gKG22OOR8KG8ysY2dyuGddcfMYZ11Vwivrak0ABuioBBfD8yGXNYFwWBt/a0A9Td
x0aK75przjcBsVtgZdOjXm5k4nIRf8hgGoma2kIKRm3g44Vm5KRZJKCqi3Kj1Kur
n42VD3u+cYt2HJ8iTxq20/2oQBvpuDeXgIJOSiWtcA+AZGKLz+9BdvolMu0lC5TE
w6e4+rFw1V1qlxRHWNRgl6qVPj8+OsUxvMn7i3ASeQKBgQD8TWnZoHJ5OXkV46c5
6p1/L1cGwHGbu2ELVTpAnWoEe3xVPbdBXa/xwZptNmkNQevxfnwgFha43bfkecLT
st0zCvCNCMh9G4qKXMVQsE1O8Q3hin0mM1o6zvyw3gvJazXMykM5Xw8OUFA4AQPu
U8elE1R9Dy7nsDiOsmat9aJH2wKBgQDuZwatAiTZWVuQqqYuGpXD8YjCeJucufk6
f3beWLfTgpqRJszlCT1/3W6VEqv4ByaYuei2pjzAmfwOEgNZTwS+6YmEGtTaGYMm
KturDoNwu+hNHKM1qSaymO7X++31vckNTx8qxaKn1HK7bXTwQYBgB8bnXeFSchkB
j7m6zh4nBwKBgFwEZ9yFVfq8aVsAYlcPKE3gmB7QRR8FIgmeFdbHEol7+AamsZVX
c/n6IDZAp+O77S9wcBjLtZHK22yqs9G95ErfbIgjceufBdIcr6IUCr4F0Ig3mBk8
lWXpY+OluCrHvSFpi0b7UmRoCjnCtQpQ5/leqWvLA9JgROBWVHiRo5QNAoGAGpwP
R7JMkKIDsWMKx2yaONO10xcJL3Ymllvx1aGLayVRwU/WYN4mKiZ6GFOMNFP//94I
VpK5hznow11JWGeUfQauHbus9GcSl2kDOdWV4DhpFmpS4UNvGVIunpb1GY/EaCLj
tK94l0kEQV1XRxXYkV9s2RhGdSBdICp9rZciEHMCgYAvR9/BoYR5KiAJ+9SV4mLX
MQVB2GxyeEhwFKeDAefvwGBhFrLBIHTAwO2lUbSeo+RSE9wy65Qawmt7BJr8g8s8
UNFR2HTb5njM+iSYkM/8OGHnCxIHRTfJaDUXlo2f8IoSrtTUMWaiiLvg/4IUzr+Q
dEKRsDvpD7rF7HPZ0+gQaQ==
-----END PRIVATE KEY-----`

};

describe('@iota-supply-tracer', () => {
    describe('demo', () => {
        let configStub;
        let product;
        afterEach(() => {
            if(configStub != null)
                configStub.restore();
        })
        it('should create and register new product', async () => {
            //Product creation
            configStub = sinon.stub(Configuration, 'loadConfiguration').returns(supplierConfig);
            const supplier = new Supplier();
            await supplier.init();
            product = await supplier.newProduct();
            //await iotaHelper.waitUntilConfirmed(product.transactionHash);
        })
        it('should transfer product', async () => {
            //Product transfer
            configStub = sinon.stub(Configuration, 'loadConfiguration').returns(supplierConfig);
            const supplier = new Supplier();
            await supplier.init();
            let transactionHash = await supplier.transferProduct(product, intermediaryConfig.certificate);
            //await iotaHelper.waitUntilConfirmed(transactionHash);
        })
        it('should transfer to end user', async () => {
            //Product transfer to end user
            configStub = sinon.stub(Configuration, 'loadConfiguration').returns(intermediaryConfig);
            const intermediary = new Supplier();
            await intermediary.init();
            let transactionHash = await intermediary.transferProductToEndUser(product);
            //await iotaHelper.waitUntilConfirmed(transactionHash);
        })
        it('should confirm product delivery', async () => {
            //Product delivery confirmation
            //configStub = sinon.stub(Configuration, 'loadConfiguration').returns(intermediaryConfig);
            const user = new User();
            // const data = await user.getProductData(product);
            // const ok = await user.verifyProduct(product);
            // if(ok){
            //     transactionHash = await user.confirmProduct(product);
            //     await iotaHelper.waitUntilConfirmed(transactionHash);
            //     console.log(`Product with id: ${product.id} is confirmed by end user [${transactionHash}]`);
            // } else {
            //     console.log(`Product with id: ${product.id} is NOT verified!!`);
            // }
        })
    })
});
