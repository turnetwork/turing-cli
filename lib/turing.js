const { ApiPromise, WsProvider } = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');
const { hexToU8a } = require('@polkadot/util');

const getApi = async (url) => {
    const provider = new WsProvider(url);
    const api = await ApiPromise.create({
        provider,
        types: {
            TokenBalance: "u128",
            Token: {
                "name": "Vec<u8>",
                "symbol": "Vec<u8>",
                "total_supply": "u128",
                "decimal": "u64"
            },
            NodeIntroduction: {
                "accountid": "AccountId",
                "name": "Vec<u8>",
                "site": "Vec<u8>",
                "detail": "Vec<u8>"
            },
            Crowdsale: {
                "beneficiary": "AccountId",
                "funding_goal": "TokenBalance",
                "amount_raised": "TokenBalance",
                "deadline": "Moment",
                "funding_goal_reached": "bool",
                "crowdsale_closed": "bool",
                "price": "u64"
            },
            Str: "Vec<u8>"
            }
        });
    return api;
}

const doWithListener = (seed, call) => {
    return new Promise(function (resolve, reject) {
      call.signAndSend(seed, (({ events = [], status }) => {
        if (status.isFinalized) {
          let result = "";
          events.forEach(({ phase, event: { data, method, section } }) => {
            result += '\t' + phase.toString() + `: ${section}.${method}` + data.toString();
          });
          resolve(result);
        }
      })).catch(err => {
        reject(" error");
      });
    });
}

/*
balance actions
*/
const balance = async (url, address) => {
    const api = await getApi(url);
    let balance = await api.query.balances.freeBalance(address);
    return balance.toString();
}

// bad design! 'good node.js /event driven' way is not wait
// but it must return a value on console, even run in callback
const transfer = async (url, key, recipient, value) => {
    //TODO: verify key and recipient.
    const api = await getApi(url);

    const keyring = new Keyring();
    const from = keyring.addFromSeed(hexToU8a(key), "", 'sr25519');

    return doWithListener(from, api.tx.balances.transfer(recipient, value));
}

/*
staking
*/
const bondController = async (url, key, controller, value) => {
    const api = await getApi(url);

    const keyring = new Keyring();
    const from = keyring.addFromSeed(hexToU8a(key), "", 'sr25519');

    return doWithListener(from, api.tx.staking.bond(controller, value, new RewardDestination()));
}

const bondSession = async (url, key, session) => {
    const api = await getApi(url);

    const keyring = new Keyring();
    const from = keyring.addFromSeed(hexToU8a(key), "", 'sr25519');

    return doWithListener(from, api.tx.session.setKey(session));
}

const validate = async (url, key) => {
    const api = await getApi(url);

    const keyring = new Keyring();
    const from = keyring.addFromSeed(hexToU8a(key), "", 'sr25519');

    const ref = new ValidatorPrefs({
        unstakeThreshold: 8,
        validatorPayment: 0,
    });

    return doWithListener(from, api.tx.staking.validate(ref));
}

const unValidate = async (url, key) => {
    const api = await getApi(url);

    const keyring = new Keyring();
    const from = keyring.addFromSeed(hexToU8a(key), "", 'sr25519');

    return doWithListener(from, api.tx.staking.chill());
}

module.exports = {
    getApi,
    doWithListener,
    balance,
    transfer,
    bondController,
    bondSession,
    validate,
    unValidate
}