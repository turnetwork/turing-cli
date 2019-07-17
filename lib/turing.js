const { ApiPromise, WsProvider } = require('@polkadot/api');
const { Keyring } = require('@polkadot/keyring');
const { hexToU8a } = require('@polkadot/util');

const getApi = async (url) => {
    const provider = new WsProvider(url);
    const api = await ApiPromise.create({
        provider,
        types: {
            TokenBalance: "u128",
            Bytes: "Vec<u8>",
            Balance_in_Token: "u128",
            Bytes32: "Vec<u8>",
            Doc: {
                "doc_uri": "Vec<u8>",
                "doc_hash": "H256"
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
            Token: "TokenBalance",
            Str: "Vec<u8>"
        }
    });
    return api;
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
    //TODO verify key and recipient.
    const api = await getApi(url);

    const keyring = new Keyring();
    const from = keyring.addFromSeed(hexToU8a(key), "", 'sr25519');

    let doWithListener = () => {
        return new Promise(function (resolve, reject) {
            api.tx.balances
                .transfer(recipient, value)
                .signAndSend(from, ({ events = [], status }) => {
                    if (status.isFinalized) {
                        let result = ""; 
                        events.forEach(({ phase, event: { data, method, section } }) => {
                            result += '\t' + phase.toString() + `: ${section}.${method}` + data.toString();
                        });
                        resolve(result);
                    }
                })
                .catch(err => {
                    reject("transfer error.");
                });
        });
    }
    return doWithListener();
}

/*
staking
*/
const bondController = async (url, key, controller, value) => {
    const api = await getApi(url);

    const keyring = new Keyring();
    const from = keyring.addFromSeed(hexToU8a(key), "", 'sr25519');


    let doWithListener = () => {
        return new Promise(function (resolve, reject) {
            api.tx.staking
                .bond(controller, value, new RewardDestination())
                .signAndSend(from, (({ events = [], status }) => {
                    if (status.isFinalized) {
                        let result = "";
                        events.forEach(({ phase, event: { data, method, section } }) => {
                            result += '\t' + phase.toString() + `: ${section}.${method}` + data.toString();
                        });
                        resolve(result);
                    }
                })).catch(err => {
                    reject("bond controller error.");
                });
        });
    }
    return doWithListener();
}

const bondSession = async (url, key, session) => {
    const api = await getApi(url);

    const keyring = new Keyring();
    const from = keyring.addFromSeed(hexToU8a(key), "", 'sr25519');

    let doWithListener = () => {
        return new Promise(function (resolve, reject) {
            api.tx.session
                .setKey(session)
                .signAndSend(from, (({ events = [], status }) => {
                    if (status.isFinalized) {
                        let result = "";
                        events.forEach(({ phase, event: { data, method, section } }) => {
                            result += '\t' + phase.toString() + `: ${section}.${method}` + data.toString();
                        });
                        resolve(result);
                    }
                })).catch(err => {
                    reject("bond session error.");
                });
        });
    }
    return doWithListener();
}

const validate = async (url, key) => {
    const api = await getApi(url);

    const keyring = new Keyring();
    const from = keyring.addFromSeed(hexToU8a(key), "", 'sr25519');

    const ref = new ValidatorPrefs({
        unstakeThreshold: 8,
        validatorPayment: 0,
    });
    let doWithListener = () => {
        return new Promise(function (resolve, reject) {
            api.tx.staking
                .validate(ref)
                .signAndSend(from, (({ events = [], status }) => {
                    if (status.isFinalized) {
                        let result = "";
                        events.forEach(({ phase, event: { data, method, section } }) => {
                            result += '\t' + phase.toString() + `: ${section}.${method}` + data.toString();
                        });
                        resolve(result);
                    }
                })).catch(err => {
                    reject("validate error.");
                });
        });
    }
    return doWithListener();
}

const unValidate = async (url, key) => {
    const api = await getApi(url);

    const keyring = new Keyring();
    const from = keyring.addFromSeed(hexToU8a(key), "", 'sr25519');

    let doWithListener = () => {
        return new Promise(function (resolve, reject) {
            api.tx.staking
                .chill()
                .signAndSend(from, (({ events = [], status }) => {
                    if (status.isFinalized) {
                        let result = "";
                        events.forEach(({ phase, event: { data, method, section } }) => {
                            result += '\t' + phase.toString() + `: ${section}.${method}` + data.toString();
                        });
                        resolve(result);
                    }
                })).catch(err => {
                    reject("unValidate error.");
                });
        });
    }
    return doWithListener();
}

module.exports = {
    balance,
    transfer,
    bondController,
    bondSession,
    validate,
    unValidate
}