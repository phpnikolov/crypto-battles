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
            "name": "",
            "type": "bytes12"
          }
        ],
        "name": "usernames",
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
        "name": "getPrices",
        "outputs": [
          {
            "name": "_miner",
            "type": "uint256"
          },
          {
            "name": "_solder",
            "type": "uint256"
          },
          {
            "name": "_house",
            "type": "uint256"
          },
          {
            "name": "_peasant",
            "type": "uint256"
          },
          {
            "name": "_castle",
            "type": "uint256"
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
            "name": "_blocks",
            "type": "uint256"
          },
          {
            "name": "_gold",
            "type": "uint256"
          },
          {
            "name": "_experience",
            "type": "uint256"
          },
          {
            "name": "_peasants",
            "type": "uint256"
          },
          {
            "name": "_peasantsToBuy",
            "type": "uint256"
          },
          {
            "name": "_miners",
            "type": "uint256"
          },
          {
            "name": "_soldiers",
            "type": "uint256"
          },
          {
            "name": "_castleLvl",
            "type": "uint256"
          },
          {
            "name": "_houses",
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
            "name": "_miners",
            "type": "uint256"
          }
        ],
        "name": "buyMiners",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_peasants",
            "type": "uint256"
          }
        ],
        "name": "buyPeasants",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_solders",
            "type": "uint256"
          }
        ],
        "name": "buySolders",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
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
