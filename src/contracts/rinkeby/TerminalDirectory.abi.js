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
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "memo",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "caller",
        "type": "address"
      }
    ],
    "name": "DeployAddress",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "beneficiary",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "preferUnstakedTickets",
        "type": "bool"
      }
    ],
    "name": "SetPayerPreferences",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "contract ITerminal",
        "name": "terminal",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "caller",
        "type": "address"
      }
    ],
    "name": "SetTerminal",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_projectId",
        "type": "uint256"
      }
    ],
    "name": "addressesOf",
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
    "name": "beneficiaryOf",
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
        "name": "_preferUnstakedTickets",
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
        "internalType": "contract ITerminal",
        "name": "_terminal",
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
    "name": "terminalOf",
    "outputs": [
      {
        "internalType": "contract ITerminal",
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
    "name": "unstakedTicketsPreferenceOf",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];