#!/usr/bin/env node

const program = require('commander');
const keyCommand = require('./keyCommand');
const turingCommand = require('./turingCommand');
const erc20Command = require('./erc20Command');

program.command('key <func>')
    .description(keyCommand.description())
    .option('-k, --key <key>', 'private key or seed')
    .option('-m, --mnemonic <mnemonic>', 'string of mnemonic')
    .option('-e, --ed25519', 'Use Ed25519/BIP39 cryptography')
    .option('-s, --sr25519', 'Use Schnorr/Ristretto x25519/BIP39 cryptography')
    .action(keyCommand.action)

program.command('turing <func>')
    .description(turingCommand.description())
    .option('-l, --url <url>', 'remote node url.')
    .option('-k, --key <key>', 'private key to sign transaction.')
    .option('-a, --address <address>', 'A address of user/recipient.')
    .option('-v, --value <value>', 'transfer value.')
    .action(turingCommand.action)

program.command('erc20 <func>')
    .description(erc20Command.description())
    .option('-l, --url <url>', 'remote node url.')
    .option('-k, --key <key>', 'private key to sign transaction.')
    .option('-a, --address <address>', 'A address of spender/recipient.')
    .option('-v, --value <value>', 'transfer value.')
    .option('-h, --tokenHash <tokenHash>', 'token hash.')
    .option('-f, --approvedFrom <from>', 'where the approved token from.')
    .option('-n, --name <name>', 'token name.')
    .option('-s, --symbol <symbol>', 'token symbol.')
    .option('-d, --decimal <decimal>', 'token decimal.')
    .option('-t, --totalSupply <totalSupply>', 'token total supply')
    .option('-o, --other <other>', 'allowance other')
    .action(erc20Command.action)
    
    

program.on('command:*', function () {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
    process.exit(1);
});

program.parse(process.argv);
