module.exports = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "domain",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256[]",
        "name": "permissionIndexes",
        "type": "uint256[]"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "packed",
        "type": "uint256"
      }
    ],
    "name": "SetOperator",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_operator",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_account",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_domain",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_permissionIndex",
        "type": "uint256"
      }
    ],
    "name": "hasPermission",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_operator",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_account",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_domain",
        "type": "uint256"
      },
      {
        "internalType": "uint256[]",
        "name": "_permissionIndexes",
        "type": "uint256[]"
      }
    ],
    "name": "hasPermissions",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "permissionsOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_operator",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_domain",
        "type": "uint256"
      },
      {
        "internalType": "uint256[]",
        "name": "_permissionIndexes",
        "type": "uint256[]"
      }
    ],
    "name": "setOperator",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "_operators",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "_domains",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[][]",
        "name": "_permissionIndexes",
        "type": "uint256[][]"
      }
    ],
    "name": "setOperators",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];