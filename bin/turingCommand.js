const turing = require('../lib/turing');
const {TURING_URL} = require('./config');

const description = () => {
    return "Operating on the turing chain \n \
\t transfer : transfer native balance to another \n \
\t balance : query native balance \n \
\t bondController : bind stash and controller account \n \
\t bondSession : bind controller and session account \n \
\t validate : declare the desire to validate for the controller \n \
\t unvalidate: declare no desire to validate";
};

const setDefaultOptions = (options) => {
    if (!options.url) {
        options.url = TURING_URL;
    }
}

const action = async (func, options) => {
    try {
        let result;
        setDefaultOptions(options);
        switch (func) {
            case 'transfer':
                if (!options.key || !options.address || !options.value) {
                    console.log('unexpected input.\n');
                    console.log('example: -l "ws://localhost:9944" -k 0x1111..111 -a 0x0000..000 -v 200000000');
                    return;
                }
                result = await turing.transfer(options.url, options.key, options.address, options.value)
                console.log(result);
                break;
            case 'balance':
                if (!options.address) {
                    console.log('unexpected input.\n');
                    console.log('example: -l "ws://localhost:9944" -a 0x0000..000 ');
                    return;
                }
                result = await turing.balance(options.url, options.address);
                console.log(result);
                break;
            case 'bondController':
                if (!options.key || !options.address || !options.value) {
                    console.log('unexpected input.\n');
                    console.log('example: -l "ws://localhost:9944" -k "0x0000...000" -a "0x00...00 | 5DGQf....hcJd"  -v 10');
                    return;
                }
                result = await turing.bondController(options.url, options.key, options.address, options.value);
                console.log(result);
                break;
            case 'bondSession':
                if (!options.key || !options.address) {
                    console.log('unexpected input.\n');
                    console.log('example: -l "ws://localhost:9944" -k "0x0000...000" -a "0x00...00 | 5DGQf....hcJd"');
                    return;
                }
                result = await turing.bondSession(options.url, options.key, options.address);
                console.log(result);
                break;
            case 'validate':
                if (!options.key) {
                    console.log('unexpected input.\n');
                    console.log('example: -l "ws://localhost:9944" -k "0x0000...000"');
                    return;
                }
                result = await turing.validate(options.url, options.key);
                console.log(result);
                break;
            case 'unValidate':
                if (!options.key) {
                    console.log('unexpected input.\n');
                    console.log('example: -l "ws://localhost:9944" -k "0x0000...000"');
                    return;
                }
                result = await turing.unValidate(options.url, options.key);
                console.log(result);
                break;
            default:
                console.log('unknown function. please use --help')
        }
    } catch (error) {
        console.log(error);
    } finally {
        process.exit(0);
    }
}

module.exports = {
    description,
    action,
}