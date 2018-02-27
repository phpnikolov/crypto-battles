// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  provider: 'http://127.0.0.1:7545',
  contract: {
    address: '0x8cdaf0cd259887258bc13a92c0a6da92698644c0',
    abi: [
      {
        "constant": true,
        "inputs": [
          {
            "name": "_addr",
            "type": "address"
          }
        ],
        "name": "isRegistered",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_addr",
            "type": "address"
          }
        ],
        "name": "getPlayer",
        "outputs": [
          {
            "name": "_username",
            "type": "bytes12"
          },
          {
            "name": "_diamonds",
            "type": "uint256"
          },
          {
            "name": "_experience",
            "type": "uint256"
          },
          {
            "name": "_strength",
            "type": "uint256"
          },
          {
            "name": "_vitaility",
            "type": "uint256"
          },
          {
            "name": "_intelligence",
            "type": "uint256"
          },
          {
            "name": "_life",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_username",
            "type": "bytes12"
          }
        ],
        "name": "register",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ]
  }
};
