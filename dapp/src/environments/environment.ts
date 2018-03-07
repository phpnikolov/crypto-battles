// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  provider: 'https://ropsten.infura.io/rsndW2tOymHA1cBffVyN',
  contract: {
    address: '0x41606e2becca8ef84c18873af24d5dfdbba9e8c4',
    abi: [
      {
        "constant": true,
        "inputs": [],
        "name": "shop",
        "outputs": [
          {
            "name": "",
            "type": "uint256[6]"
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
            "name": "",
            "type": "uint8"
          }
        ],
        "name": "creatures",
        "outputs": [
          {
            "name": "damage",
            "type": "uint16"
          },
          {
            "name": "health",
            "type": "uint16"
          },
          {
            "name": "gold",
            "type": "uint24"
          },
          {
            "name": "experience",
            "type": "uint24"
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
            "name": "",
            "type": "address"
          }
        ],
        "name": "players",
        "outputs": [
          {
            "name": "username",
            "type": "bytes12"
          },
          {
            "name": "registrationBlock",
            "type": "uint256"
          },
          {
            "name": "lastSynced",
            "type": "uint256"
          },
          {
            "name": "level",
            "type": "uint8"
          },
          {
            "name": "gold",
            "type": "uint256"
          },
          {
            "name": "experience",
            "type": "uint256"
          },
          {
            "name": "points",
            "type": "uint256"
          },
          {
            "name": "currentHealth",
            "type": "uint256"
          },
          {
            "name": "damage",
            "type": "uint256"
          },
          {
            "name": "health",
            "type": "uint256"
          },
          {
            "name": "regeneration",
            "type": "uint256"
          },
          {
            "name": "deadOn",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "getBattles",
        "outputs": [
          {
            "name": "_cType0",
            "type": "uint8"
          },
          {
            "name": "_cCount0",
            "type": "uint8"
          },
          {
            "name": "_cType1",
            "type": "uint8"
          },
          {
            "name": "_cCount1",
            "type": "uint8"
          },
          {
            "name": "_cType2",
            "type": "uint8"
          },
          {
            "name": "_cCount2",
            "type": "uint8"
          },
          {
            "name": "_cType3",
            "type": "uint8"
          },
          {
            "name": "_cCount3",
            "type": "uint8"
          },
          {
            "name": "_cType4",
            "type": "uint8"
          },
          {
            "name": "_cCount4",
            "type": "uint8"
          },
          {
            "name": "_cType5",
            "type": "uint8"
          },
          {
            "name": "_cCount5",
            "type": "uint8"
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
        "inputs": [],
        "name": "getInfo",
        "outputs": [
          {
            "name": "_round",
            "type": "uint256"
          },
          {
            "name": "_blockNumber",
            "type": "uint256"
          },
          {
            "name": "_currentHealth",
            "type": "uint256"
          },
          {
            "name": "_isDead",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "getItems",
        "outputs": [
          {
            "name": "",
            "type": "uint256[8]"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "getPastBattles",
        "outputs": [
          {
            "name": "",
            "type": "uint256[6]"
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
            "name": "_itemId",
            "type": "uint8"
          },
          {
            "name": "_round",
            "type": "uint256"
          }
        ],
        "name": "buyItem",
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
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_battleId",
            "type": "uint8"
          }
        ],
        "name": "fight",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "kill",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_damagePoints",
            "type": "uint256"
          },
          {
            "name": "_healthPoints",
            "type": "uint256"
          },
          {
            "name": "_regenerationPoints",
            "type": "uint256"
          }
        ],
        "name": "setPoints",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ]
  }
};
