module.exports = [
  {
    "inputs": [
      {
        "internalType": "contract ITerminalV1",
        "name": "_terminalV1",
        "type": "address"
      },
      {
        "internalType": "contract ITimelockStaker",
        "name": "_staker",
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
        "indexed": false,
        "internalType": "address",
        "name": "voter",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "budgetId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "configured",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "yay",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Vote",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "terminalV1",
    "outputs": [
      {
        "internalType": "contract ITerminalV1",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "staker",
    "outputs": [
      {
        "internalType": "contract ITimelockStaker",
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
        "name": "_budgetId",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_yay",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];