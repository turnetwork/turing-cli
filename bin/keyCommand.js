const wallet = require('../lib/wallet');
const {toStringify} = require('./utils');

const description = () => {
    return "Account manager \n \
\t create : Create a common account \n \
\t fromSeed : recover account by seed \n \
\t fromMnemonic : recover account by mnemonic";
}

const action = async (func, options) => {
    try {
        let account = '';
        let keyType = options.ed25519 ? 'ed25519' : 'sr25519';
        switch (func) {
            case 'create':
                account = await wallet.createAccount(keyType);
                console.log(toStringify(account));
                break;
            case 'fromSeed':
                if (!options.key) {
                    console.log('unexpected input.\n');
                    return;
                }
                account = await wallet.fromSeed(options.key, keyType);
                console.log(toStringify(account));
                break;
            case 'fromMnemonic':
                if (!options.mnemonic) {
                    console.log('unexpected input.\n');
                    return;
                }
                account = await wallet.fromMnemonic(options.mnemonic, keyType);
                console.log(toStringify(account));
                break;
            default:
                console.log("unknown function. please use --help");
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    description,
    action
}