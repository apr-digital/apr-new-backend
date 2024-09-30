const Cryptr = require('cryptr');
const cryptr = new Cryptr('ourAprSecretKey');

function encrypt(text) {
    const encryptedString = cryptr.encrypt(text);
    return encryptedString;
}

function decrypt(text) {
    const decryptedString = cryptr.decrypt(text);
    return decryptedString;
}

module.exports = {
    encrypt,
    decrypt
}