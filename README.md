Turing's command line tool.
--------

Command line tools to simplify user operations.

## Actions

### Key

- create common account.

### Configuration

- config turing's URL: setTuringUrl(url)

### Basic information

- query account balance on turing: getTuringBalance(account)

## Install
```
npm install turing-cli -g
```

## Examples

## Account

### create  
```
turing-cli key create
```

return
```
{
    "privateKey": "0x8d0ec387fe5a1c78194bb970735cc56275a58b94b95c18fd5be328e6b6e8bb66",
    "mnemonic": "energy act eight begin west find tackle cloth fog virus rotate piece",
    "turingAddress": "5GNsNWgkpDQmGSijppxzQvCeKVkPZruCoYNQadFDTbyTNrP8",
    "turingPublicKey": "0xbecb61426cca8433908b5d253713f96deb1d46f066e5a9fe68eb38955e55f032",
    "type": "sr25519"
}
```
### fromSeed
```
turing-cli key fromSeed -k 0x8d0ec387fe5a1c78194bb970735cc56275a58b94b95c18fd5be328e6b6e8bb66
```

return
```
{
    "privateKey": "0x8d0ec387fe5a1c78194bb970735cc56275a58b94b95c18fd5be328e6b6e8bb66",
    "turingAddress": "5GNsNWgkpDQmGSijppxzQvCeKVkPZruCoYNQadFDTbyTNrP8",
    "turingPublicKey": "0xbecb61426cca8433908b5d253713f96deb1d46f066e5a9fe68eb38955e55f032",
    "type": "sr25519"
}
```

### fromMnemonic
```
turing-cli key fromMnemonic -m "energy act eight begin west find tackle cloth fog virus rotate piece"
```

return 
```
{
    "privateKey": "0x8d0ec387fe5a1c78194bb970735cc56275a58b94b95c18fd5be328e6b6e8bb66",
    "mnemonic": "energy act eight begin west find tackle cloth fog virus rotate piece",
    "turingAddress": "5GNsNWgkpDQmGSijppxzQvCeKVkPZruCoYNQadFDTbyTNrP8",
    "turingPublicKey": "0xbecb61426cca8433908b5d253713f96deb1d46f066e5a9fe68eb38955e55f032",
    "type": "sr25519"
}
```

### ｂalance
```
turing-cli turing balance -a 0xd573CaDe061a4A6E602F30931181805785B9505f
```
- `-a`: The account on turing chain.

return
```
1000000000000000 
```

### transfer
```
turing-cli turing transfer -k 0x8d0ec387fe5a1c78194bb970735cc56275a58b94b95c18fd5be328e6b6e8bb66 -a 5CLYXYBPW69yseghrupbtbWneysD35z9btEuGN2F4ymcJ2DG -v 100
```
- `-k`: The private key of sender.
- `-a`: The account on turing chain.
- `-v`: The value to be sended.

return
```
 {"ApplyExtrinsic":2}: indices.NewAccountIndex["5CLYXYBPW69yseghrupbtbWneysD35z9btEuGN2F4ymcJ2DG","F7pv"]      {"ApplyExtrinsic":2}: balances.NewAccount["5CLYXYBPW69yseghrupbtbWneysD35z9btEuGN2F4ymcJ2DG",1000000000000000]   {"ApplyExtrinsic":2}: balances.Transfer["5FRiXU6fNtDyePmukE6PPmBdjwtzcccHFd2CpsN9dZ8tTDQF","5CLYXYBPW69yseghrupbtbWneysD35z9btEuGN2F4ymcJ2DG",1000000000000000,1000000000000] {"ApplyExtrinsic":2}: system.ExtrinsicSuccess[]
```
