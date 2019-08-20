const { getApi, doWithListener } = require('./turing');
const { Keyring } = require('@polkadot/keyring');
const { hexToU8a, u8aToString, bnToBn, stringToU8a, u8aToHex } = require('@polkadot/util');

const transfer = async (url, key, tokenHash, recipient, value) => {
    const api = await getApi(url);
    const from = new Keyring().addFromSeed(hexToU8a(key), "", 'sr25519');

    return doWithListener(from, api.tx.erc20.transfer(tokenHash, recipient, value));
};

const transferFrom = async (url, key, tokenHash, from, recipient, value) => {
    const api = await getApi(url);
    const sender = new Keyring().addFromSeed(hexToU8a(key), "", 'sr25519');

    return doWithListener(sender, api.tx.erc20.transferFrom(tokenHash, from, recipient, value));
};

const approve = async (url, key, tokenHash, spender, value) => {
    const api = await getApi(url);
    const from = new Keyring().addFromSeed(hexToU8a(key), "", 'sr25519');

    return doWithListener(from, api.tx.erc20.approve(tokenHash, spender, value));
};

const createToken = async (url, key, name, symbol, totalSupply, decimal) => {
    const api = await getApi(url);
    const from = new Keyring().addFromSeed(hexToU8a(key), "", 'sr25519');

    const act_totalSupply = bnToBn(totalSupply).mul(bnToBn(10).pow(bnToBn(decimal)));

    return doWithListener(from, api.tx.erc20.createToken(name, symbol, act_totalSupply, decimal));
};

const queryToken = async (url, tokenHash) => {
    const api = await getApi(url);
    const t = await api.query.eRC20.tokens(tokenHash);
    console.log(t.toString());
    let token ={
        name: u8aToString(new Uint8Array(t.name)),
        symbol: u8aToString(new Uint8Array(t.symbol)),
        totalSupply: t.total_supply.toString(),
        decimal: t.decimal.toString(),
    }
    return token;
}

module.exports = {
    transfer,
    transferFrom,
    approve,
    createToken,
    queryToken
}