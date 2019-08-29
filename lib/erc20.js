const { getApi, doWithListener } = require('./turing');
const { Keyring } = require('@polkadot/keyring');
const { hexToU8a, u8aToString, bnToBn } = require('@polkadot/util');

const transfer = async (url, key, tokenHash, recipient, value) => {
    const api = await getApi(url);
    const from = new Keyring().addFromSeed(hexToU8a(key), "", 'sr25519');

    return doWithListener(from, api.tx.erc20.transfer(tokenHash, recipient, await getValue(api, tokenHash, value)));
};

const transferFrom = async (url, key, tokenHash, from, recipient, value) => {
    const api = await getApi(url);
    const sender = new Keyring().addFromSeed(hexToU8a(key), "", 'sr25519');

    return doWithListener(sender, api.tx.erc20.transferFrom(tokenHash, from, recipient, await getValue(api, tokenHash, value)));
};

const approve = async (url, key, tokenHash, spender, value) => {
    const api = await getApi(url);
    const from = new Keyring().addFromSeed(hexToU8a(key), "", 'sr25519');

    return doWithListener(from, api.tx.erc20.approve(tokenHash, spender, await getValue(api, tokenHash, value)));
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
    const token ={
        name: u8aToString(new Uint8Array(t.name)),
        symbol: u8aToString(new Uint8Array(t.symbol)),
        totalSupply: getActualValue(api, tokenHash, t.total_supply.toString()),
        decimal: t.decimal.toString(),
    }
    return token;
}

const queryBalance = async (url, address, tokenHash) => {
    const api = await getApi(url);
    const b = await api.query.eRC20.balances([tokenHash, address]);
    return await getActualValue(api, tokenHash, b.toString());
}

const queryAllowances = async (url, address, tokenHash, other) => {
    const api = await getApi(url);
    const allowances = await api.query.eRC20.allowances([tokenHash, address, other]);
    return await getAcutalValue(api, tokenHash, allowances.toString());
}

const getValue = async(api, tokenHash, value) => {
    const token = await api.query.eRC20.tokens(tokenHash);
    const v = bnToBn(value).mul(bnToBn(10).pow(bnToBn(token.decimal.toNumber())));
    return v;
}

const getActualValue = async(api, tokenHash, value) => {
    const token = await api.query.eRC20.tokens(tokenHash);
    const v = bnToBn(value).div(bnToBn(10).pow(bnToBn(token.decimal.toNumber())));
    return v;
}

module.exports = {
    transfer,
    transferFrom,
    approve,
    createToken,
    queryToken,
    queryBalance,
    queryAllowances
}