const erc20 = require('../lib/erc20');
const { setDefaultOptions } = require('./turingCommand');

const description = () => {
    return "Operating on the erc20 module \n \
\t transfer : transfer erc20 balance to another \n \
\t transferFrom : transfer erc20 balance from approved account to another \n \
\t approve : approve erc20 balance to another \n \
\t createToken: create erc20 token";
};

const action = async (func, options) => {
    try {
        let result;
        setDefaultOptions(options);
        switch (func) {
            case 'transfer':
                if (!options.key || !options.address || !options.value || !options.tokenHash) {
                    console.log('unexpected input.\n');
                    console.log('example: -l "ws://localhost:9944" -k 0x1111..111 -h 0x1234...678 -a 5Gr...tQY -v 200000000');
                    return;
                }
                result = await erc20.transfer(options.url, options.key, options.tokenHash, options.address, options.value);
                console.log(result);
                break;
            case 'transferFrom':
                if (!options.key || !options.address || !options.value || !options.tokenHash || !options.from) {
                    console.log('unexpected input.\n');
                    console.log('example: -l "ws://localhost:9944" -k 0x1111..111 -h 0x1234...678 -f 5Gr...234 -a 5Gr...tQY -v 200000000');
                    return;
                }
                result = await erc20.transferFrom(options.url, options.key, options.tokenHash, options.from, options.address, options.value);
                console.log(result);
                break;
            case 'approve':
                if (!options.key || !options.address || !options.value || !options.tokenHash) {
                    console.log('unexpected input.\n');
                    console.log('example: -l "ws://localhost:9944" -k 0x1111..111 -h 0x1234...678 -a 5Gr...tQY -v 200000000');
                    return;
                }
                result = await erc20.approve(options.url, options.key, options.tokenHash, options.address, options.value);
                console.log(result);
                break;
            case 'createToken':
                if (!options.key || !options.name || !options.symbol || !options.totalSupply || !options.decimal) {
                    console.log('unexpected input.\n');
                    console.log('example: -l "ws://localhost:9944" -k 0x1111..111 -n Turing Token -s TNK -t 200000000 -d 10');
                    return;
                }
                result = await erc20.createToken(options.url, options.key, options.name, options.symbol, options.totalSupply, options.decimal);
                console.log(result);
                break;
            case 'queryToken':
                if(!options.tokenHash){
                    console.log('unexpected input.\n');
                    console.log('example: -l "ws://localhost:9944" -h 0x1234...678');
                    return;
                }
                result = await erc20.queryToken(options.url, options.tokenHash);
                console.log(result);
                break;
            case 'queryBalance':
                if(!options.tokenHash || !options.address) {
                    console.log('unexpected input.\n');
                    console.log('example: -l "ws://localhost:9944" -h 0x1234...678 -a 5Gr...tQY');
                    return ;
                }
                result = await erc20.queryBalance(options.url, options.address, options.tokenHash);
                console.log("The balance of account(" + options.address + "): " + result);
                break;
            case 'queryAllowances':
                        if(!options.tokenHash || !options.address) {
                            console.log('unexpected input.\n');
                            console.log('example: -l "ws://localhost:9944" -h 0x1234...678 -a 5Gr...tQY');
                            return ;
                        }
                        result = await erc20.queryAllowances(options.url, options.address, options.tokenHash, options.other);
                        console.log("The allowances of account(" + options.address + "): " + result);
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
    action
}