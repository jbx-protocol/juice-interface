module.exports = [
  {
    "inputs": [
      {
        "internalType": "contract IJuicer",
        "name": "_juicer",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_ticketName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_ticketSymbol",
        "type": "string"
      },
      {
        "internalType": "contract IERC20",
        "name": "_ticketReward",
        "type": "address"
      },
      {
        "internalType": "contract UniswapV2Router02",
        "name": "_router",
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
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "contract IJuicer",
        "name": "_from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_to",
        "type": "address"
      }
    ],
    "name": "allowMigration",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IJuicer",
        "name": "_juicer",
        "type": "address"
      }
    ],
    "name": "appointJuicer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "budgetOwner",
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
        "name": "_target",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_duration",
        "type": "uint256"
      },
      {
        "internalType": "contract IERC20",
        "name": "_want",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_link",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_discountRate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_o",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_b",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_bAddress",
        "type": "address"
      }
    ],
    "name": "configureBudget",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IJuicer",
        "name": "_juicer",
        "type": "address"
      }
    ],
    "name": "deprecateJuicer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IAccessControlWrapper",
        "name": "_contract",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_newAdmin",
        "type": "address"
      }
    ],
    "name": "grantRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "issueTickets",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "juicer",
    "outputs": [
      {
        "internalType": "contract IJuicer",
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
        "internalType": "contract IJuicer",
        "name": "_to",
        "type": "address"
      }
    ],
    "name": "migrate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
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
        "internalType": "address",
        "name": "_issuer",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_minRewardAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_minSwappedAmount",
        "type": "uint256"
      },
      {
        "internalType": "contract IJuicer",
        "name": "_juicer",
        "type": "address"
      }
    ],
    "name": "redeemTicketsAndFund",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IAccessControlWrapper",
        "name": "_contract",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_newAdmin",
        "type": "address"
      }
    ],
    "name": "revokeRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "router",
    "outputs": [
      {
        "internalType": "contract UniswapV2Router02",
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
        "name": "_budgetOwner",
        "type": "address"
      }
    ],
    "name": "setBudgetOwner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IJuicer",
        "name": "_juicer",
        "type": "address"
      },
      {
        "internalType": "contract IERC20[]",
        "name": "_list",
        "type": "address[]"
      }
    ],
    "name": "setWantTokenAllowList",
    "outputs": [],
    "stateMutability": "nonpayable",
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
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_beneficiary",
        "type": "address"
      }
    ],
    "name": "tapBudget",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ticketName",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ticketReward",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ticketSymbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];