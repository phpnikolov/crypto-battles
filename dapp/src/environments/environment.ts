// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  provider: 'http://127.0.0.1:8545',
  contract: {
    address: '0x7bbdb152b1f073e400def62fc3fea5322ecd0a8f',
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
        "inputs": [],
        "name": "getPlayer",
        "outputs": [
          {
            "name": "_username",
            "type": "bytes12"
          },
          {
            "name": "_level",
            "type": "uint256"
          },
          {
            "name": "_day",
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
            "name": "_maxHealth",
            "type": "uint256"
          },
          {
            "name": "_damage",
            "type": "uint256"
          },
          {
            "name": "_healthPer100Blocks",
            "type": "uint256"
          },
          {
            "name": "_health",
            "type": "uint256"
          },
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
          },
          {
            "name": "_deadOn",
            "type": "uint256"
          },
          {
            "name": "_blockNumber",
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
        "name": "getCreatures",
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
            "name": "_uinits0",
            "type": "uint256"
          },
          {
            "name": "_cType1",
            "type": "uint8"
          },
          {
            "name": "_uinits1",
            "type": "uint256"
          },
          {
            "name": "_cType2",
            "type": "uint8"
          },
          {
            "name": "_uinits2",
            "type": "uint256"
          },
          {
            "name": "_cType3",
            "type": "uint8"
          },
          {
            "name": "_uinits3",
            "type": "uint256"
          },
          {
            "name": "_cType4",
            "type": "uint8"
          },
          {
            "name": "_uinits4",
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
            "name": "_creatureIdx",
            "type": "uint8"
          }
        ],
        "name": "attackCreature",
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
      },
      {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      }
    ]
  }
};
