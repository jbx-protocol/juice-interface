module.exports = [
  {
    "inputs": [
      {
        "internalType": "contract IProjects",
        "name": "_projects",
        "type": "address"
      },
      {
        "internalType": "contract IOperatorStore",
        "name": "_operatorStore",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_projectId",
        "type": "uint256"
      }
    ],
    "name": "addresses",
    "outputs": [
      {
        "internalType": "contract IDirectPaymentAddress[]",
        "name": "",
        "type": "address[]"
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
      }
    ],
    "name": "beneficiaries",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_projectId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_memo",
        "type": "string"
      }
    ],
    "name": "deployAddress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "operatorStore",
    "outputs": [
      {
        "internalType": "contract IOperatorStore",
        "name": "",
        "type": "address"
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
      }
    ],
    "name": "preferConvertedTickets",
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
    "inputs": [],
    "name": "projects",
    "outputs": [
      {
        "internalType": "contract IProjects",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_beneficiary",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "_preferClaimedTickets",
        "type": "bool"
      }
    ],
    "name": "setPayerPreferences",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_projectId",
        "type": "uint256"
      },
      {
        "internalType": "contract IJuiceTerminal",
        "name": "_juiceTerminal",
        "type": "address"
      }
    ],
    "name": "setTerminal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "terminals",
    "outputs": [
      {
        "internalType": "contract IJuiceTerminal",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];