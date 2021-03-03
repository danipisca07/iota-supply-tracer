'use strict';
const { expect } = require('chai');
const crypto = require('crypto');
const { sign } = require('./message-signer');
const MessageSigner = require('./message-signer');

const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDH0RoPIFWqW5VN
cC4gQSCrXopqSXkbZmh1epBMbUhSZ6IpLqW7Sg40g0z/zE6qY8dKbyNgpxxb0XKq
KCBoMm70G+Tpj1WIxQ3gRw89v64/70oYKwlFhVALBGTfaFJ3zsuKJR0B30RTdYE5
+9ZvMnyusUZKZTj94xAor7mA+x3mZ++EI29ecYzWyoJvGyYRtINO9SsS0Zgne/5y
sZo3vltErjsP63WqdeX8ExHDKflDSePvFlEejQoCY0fa4f00VFZwgz2kgB0Jz6Tj
lvGvXpJyBlU1iEZ89pSf7hZO/YIZruToJtKvoJ6SHrYoLtMW7L23dQm7b27wpMe8
6S85A6NHAgMBAAECggEBAK6rWjVI1bnSzyPfYWLuq6lCPosE6SoLjlrLpiI5EZR/
ZSDM1zFuXhaHhKLDLS0Dhe3KU0mlK0QURkD6TMHo/FbFn4iPtHyXjTa1x1v6GE9p
VQLlc/hivgKzd55XqmdyzThYkw/U5Pxz5mAShnOz1Yw8CS71ZymA+NooKmfWnF+Q
hRoZyu2jyq3Vgwe5m7a76DnZYiosHpmnhRLWvBbqtgn8+i06aMYxwzjL+8yb7iPM
zIa8yqaZplr19kn3cgX1htdyTRiXznTwicjCiHUFfir1oAqEuZ9UQsFK1W/Kk+Wz
4vJOlB8UhXlEzTV7dY/ONyfo4/XDQo6OIBgcq1i8OYkCgYEA9C6+o9YAiEXIlXx7
x63EYSnDmB6jWjhrjQQOie2Z0MERKnw1f68B6fGgmr7ZbirQjDXI5i/KTpWEWTQV
S5BHkeXiiqXU486vAMrHjuCysWxRsebC8axh/013aGGqYakBLHAyN+C0p7IIM63L
+nKJxcYGOApSdHzlyYaWzNFWyJUCgYEA0Xyx/nRzSVSa4F9DmaRhiFH9BOQXrl5b
oetGdQ/bB18vh8eaCEPS2tvyPbWQ8g19kqzg3Gfjjvb4elpTXQEXjkZ6FpvR69GN
lOApHSmCPXBzp+xPtXzTlLGtYoarDBkT4xkO/V5ec37tMhLkGXiSwEp7fPOPU+DF
jfAylFt6WWsCgYAq864FE7e0QNIvuV3smdxZWwdU0s7ZJ+ODQptsF6de2Rcz6fVf
KGGlzSL7FWcZwd49S5izJOTpPdOx/T9hs1djipR23wS7rbeK5CCGOXA1VWBpcrYH
3NLAHdhLPCLEWv4h2vp6acRdWyumK4Qd4dfqOhMN+ILYir/A2zPbg1dIoQKBgQCF
5M1fdc657/mNr1XlvcsY9k5h8eew615l/5ro91lnPM+EWW96GN+MQ0hxaLtb+oNo
XFbciQpJNlFa4qClsSz9Is6l5LInp6h2n0+n8//qhRVnHwNTXJVfVLEdaDWrZdvw
KvQJvWdhKp8wgiKIpSgm/3QuSP4y/ldGgV/SsyVgQQKBgDduAL2lDMnxpHfib/Bm
H+fEUzbJO5GUaFPx9OhJyQa89B5VZg0xF3jhRIDSI5PjllvcU/MTzvXt6qpdj02l
cOmkVjW3N87dfxKzj/nBLB2jWAuSaLopeFCyUNjH94q7BA1Gm1+YSwqRfDErz27I
sLQvfUVxvNeMWK6D8EQmaRh2
-----END PRIVATE KEY-----
`
const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAx9EaDyBVqluVTXAuIEEg
q16Kakl5G2ZodXqQTG1IUmeiKS6lu0oONINM/8xOqmPHSm8jYKccW9FyqiggaDJu
9Bvk6Y9ViMUN4EcPPb+uP+9KGCsJRYVQCwRk32hSd87LiiUdAd9EU3WBOfvWbzJ8
rrFGSmU4/eMQKK+5gPsd5mfvhCNvXnGM1sqCbxsmEbSDTvUrEtGYJ3v+crGaN75b
RK47D+t1qnXl/BMRwyn5Q0nj7xZRHo0KAmNH2uH9NFRWcIM9pIAdCc+k45bxr16S
cgZVNYhGfPaUn+4WTv2CGa7k6CbSr6Cekh62KC7TFuy9t3UJu29u8KTHvOkvOQOj
RwIDAQAB
-----END PUBLIC KEY-----
`;

const wrongPrivateKey = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDH0RoPIFWqW5VN
cA4gQSCrXopqSXkbZmh1epBMbUhSZ6IpLqW7Sg40g0z/zE6qY8dKbyNgpxxb0XKq
KCBoMm70G+Tpj1WIxQ3gRw89v64/70oYKwlFhVALBGTfaFJ3zsuKJR0B30RTdYE5
+9ZvMnyusUZKZTj94xAor7mA+x3mZ++EI29ecYzWyoJvGyYRtINO9SsS0Zgne/5y
sZo3vltErjsP63WqdeX8ExHDKflDSePvFlEejQoCY0fa4f00VFZwgz2kgB0Jz6Tj
lvGvXpJyBlU1iEZ89pSf7hZO/YIZruToJtKvoJ6SHrYoLtMW7L23dQm7b27wpMe8
6S85A6NHAgMBAAECggEBAK6rWjVI1bnSzyPfYWLuq6lCPosE6SoLjlrLpiI5EZR/
ZSDM1zFuXhaHhKLDLS0Dhe3KU0mlK0QURkD6TMHo/FbFn4iPtHyXjTa1x1v6GE9p
VQLlc/hivgKzd55XqmdyzThYkw/U5Pxz5mAShnOz1Yw8CS71ZymA+NooKmfWnF+Q
hRoZyu2jyq3Vgwh5m7a76DnZYiosHpmnhRLWvBbqtgn8+i06aMYxwzjL+8yb7iPM
zIa8yqaZplr19kn3cgX1htdyTRiXznTwicjCiHUFfir1oAqEuZ9UQsFK1W/Kk+Wz
4vJOlB8UhXlEzTV7dY/ONyfo4/XDQo6OIBgcq1i8OYkCgYEA9C6+o9YAiEXIlXx7
x63EYSnDmB6jWjhrjQQOie2Z0MERKnw1f68B6fGgmr7ZbirQjDXI5i/KTpWEWTQV
S5BHkeXiiqXU486vAMrHjuCysWxRsebC8axh/013aGGqYakBLHAyN+C0p7IIM63L
+nKJxcYGOApSdHzlyYaWzNFWyJUCgYEA0Xyx/nRzSVSa4F9DmaRhiFH9BOQXrl5b
oetGdQ/bB18vh8eaCEPS2tvyPbWQ8g19kqzg3Gfjjvb4elpTXQEXjkZ6FpvR69GN
lOApHSmCPXBzp+xPtXzTlLGtYoarDBkT4xkO/V5ec37tMhLkGXiSwEp7fPOPU+DF
jfAylFt6WWsCgYAq864FE7e0QNIvuV3smdxZWwdU0s7ZJ+ODQptsF6de2Rcz6fVf
KGGlzSL7FWcZwd49S5izJOTpPdOx/T9hs1djipR23wS7rbeK5CCGOXA1VWBpcrYH
3NLAHdhLPCLEWv4h2vp6acRdWyumK4Qd4dfqOhMN+ILYir/A2zPbg1dIoQKBgQCF
5M1fdc657/mNr1XlvcsY9k5h8eew615l/5ro91lnPM+EWW96GN+MQ0hxaLtb+oNo
XFbciQpJNlFa4qClsSz9Is6l5LInp6h2n0+n8//qhRVnHwNTXJVfVLEdaDWrZdvw
KvQJvWdhKp8wgiKIpSgm/3QuSP4y/ldGgV/SsyVgQQKBgDduAL2lDMnxpHfib/Bm
H+fEUzbJO5GUaFPx9OhJyQa89B5VZg0xF3jhRIDSI5PjllvcU/MTzvXt6qpdj02l
cOmkVjW3N87dfxKzj/nBLB2jWAuSaLopeFCyUNjH94q7BA1Gm1+YSwqRfDErz27I
sLQvfUVxvNeMWK6D8EQmaRh2
-----END PRIVATE KEY-----
`
const wrongPublicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAx9EaDyBVqluVTXAuIEEg
q16Kakl5G2ZodXqQTG1IUmeiKS6lu0oONINM/8xOqmPHSm8jYKccW9FyqiggaDJu
9Bvk6Y9ViMUN4EcPPb+uP+9KGCsJRYVQCwRk32hSd87LiiUdAd9EU3WBOfvWbzJ8
rrFGSmU4/eMQKK+5gPsd5mfvweNvXnGM1sqCbxsmEbSDTvUrEtGYJ3v+crGaN75b
RK47D+t1qnXl/BMRwyn5Q0nj7xZRHo0KAmNH2uH9NFRWcIM9pIAdCc+k45bxr16S
cgZVNYhGfPaUn+4WTv2CGa7k6CbSr6Cekh62KC7TFuy9t3UJu29u8KTHvOkvOQOj
RwIDAQAB
-----END PUBLIC KEY-----
`;

describe('message-signer', () => {
    it('should sign then verify message with right key', () => {
        const msg = "Test message";
        
        const signature = MessageSigner.sign(msg, privateKey);

        const ok = MessageSigner.verify(msg, signature, publicKey);
        expect(ok).to.be.true;
    })

    it('should sign then not verify message with wrong priv key', () => {
        const msg = "Test message";
        
        const signature = MessageSigner.sign(msg, wrongPrivateKey);

        const ok = MessageSigner.verify(msg, signature, publicKey);
        expect(ok).to.be.false;
    })

    it('should sign then not verify message with wrong pub key', () => {
        const msg = "Test message";
        
        const signature = MessageSigner.sign(msg, privateKey);

        const ok = MessageSigner.verify(msg, signature, wrongPublicKey);
        expect(ok).to.be.false;
    })

});
