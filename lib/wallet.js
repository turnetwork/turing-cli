const Wallet = require('ethers').Wallet;
const { hexToU8a , u8aToHex } = require('@polkadot/util');
const { Keyring } = require('@polkadot/keyring');
const { cryptoWaitReady } = require('@polkadot/util-crypto');
/*
create turing account. use common private key.
*/

const toCommonAccount = async (ethAccount, keyType) => {
    await cryptoWaitReady();
    const keyring = new Keyring({type: keyType});
    const turingAccount = keyring.addFromSeed(hexToU8a(ethAccount.privateKey));
    let comAccount = {
        privateKey: ethAccount.privateKey,
        mnemonic: ethAccount.mnemonic,
        turingAddress: turingAccount.address,
        turingPublicKey: u8aToHex(turingAccount.publicKey()),
        type: turingAccount.type,
    }
    return comAccount;
}

const createAccount = async (keyType) => {
    const ethAccount = Wallet.createRandom();
    return toCommonAccount(ethAccount, keyType)
}

const fromSeed = async (key, keyType) => {
    const ethAccount = new Wallet(key);
    return toCommonAccount(ethAccount, keyType)
}

const fromMnemonic = async (mnemonic, keyType) => {
    const ethAccount = Wallet.fromMnemonic(mnemonic);
    return toCommonAccount(ethAccount, keyType);
}

// TODO
const fromJson = (json, password) => {
    return undefined;
}

module.exports = {
    createAccount,
    fromSeed,
    fromMnemonic,
    fromJson,
}