module.exports = [
  {
    "inputs": [
      {
        "internalType": "contract IPrices",
        "name": "_prices",
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
        "name": "budgetId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "target",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "currency",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "duration",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "link",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "discountRate",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "bondingCurveRate",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "reserved",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "donationRecipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "donationAmount",
        "type": "uint256"
      }
    ],
    "name": "Configure",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "appointAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "budgetBallot",
    "outputs": [
      {
        "internalType": "contract IBudgetBallot",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "budgetCount",
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
        "internalType": "uint256",
        "name": "_target",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_currency",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_duration",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
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
        "name": "_bondingCurveRate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_reserved",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_donationRecipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_donationAmount",
        "type": "uint256"
      }
    ],
    "name": "configure",
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
    "inputs": [],
    "name": "fee",
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
        "internalType": "uint256",
        "name": "_budgetId",
        "type": "uint256"
      }
    ],
    "name": "getBudget",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "project",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "number",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "previous",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "link",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "target",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "currency",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "total",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "start",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "duration",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tappedTarget",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tappedTotal",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "reserved",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "donationRecipient",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "donationAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "fee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "weight",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "discountRate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "bondingCurveRate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "configured",
            "type": "uint256"
          },
          {
            "internalType": "contract IBudgetBallot",
            "name": "ballot",
            "type": "address"
          }
        ],
        "internalType": "struct Budget.Data",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_project",
        "type": "address"
      }
    ],
    "name": "getCurrentBudget",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "project",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "number",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "previous",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "link",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "target",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "currency",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "total",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "start",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "duration",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tappedTarget",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tappedTotal",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "reserved",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "donationRecipient",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "donationAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "fee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "weight",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "discountRate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "bondingCurveRate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "configured",
            "type": "uint256"
          },
          {
            "internalType": "contract IBudgetBallot",
            "name": "ballot",
            "type": "address"
          }
        ],
        "internalType": "struct Budget.Data",
        "name": "budget",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_project",
        "type": "address"
      }
    ],
    "name": "getQueuedBudget",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "project",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "number",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "previous",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "link",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "target",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "currency",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "total",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "start",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "duration",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tappedTarget",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tappedTotal",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "reserved",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "donationRecipient",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "donationAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "fee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "weight",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "discountRate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "bondingCurveRate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "configured",
            "type": "uint256"
          },
          {
            "internalType": "contract IBudgetBallot",
            "name": "ballot",
            "type": "address"
          }
        ],
        "internalType": "struct Budget.Data",
        "name": "",
        "type": "tuple"
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
    "name": "isAdmin",
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
      }
    ],
    "name": "latestBudgetId",
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
        "name": "_project",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "payProject",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "project",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "number",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "previous",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "link",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "target",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "currency",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "total",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "start",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "duration",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tappedTarget",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tappedTotal",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "reserved",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "donationRecipient",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "donationAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "fee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "weight",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "discountRate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "bondingCurveRate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "configured",
            "type": "uint256"
          },
          {
            "internalType": "contract IBudgetBallot",
            "name": "ballot",
            "type": "address"
          }
        ],
        "internalType": "struct Budget.Data",
        "name": "budget",
        "type": "tuple"
      },
      {
        "internalType": "uint256",
        "name": "convertedCurrencyAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "overflow",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "prices",
    "outputs": [
      {
        "internalType": "contract IPrices",
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
        "name": "account",
        "type": "address"
      }
    ],
    "name": "revokeAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IBudgetBallot",
        "name": "_budgetBallot",
        "type": "address"
      }
    ],
    "name": "setBudgetBallot",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_fee",
        "type": "uint256"
      }
    ],
    "name": "setFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "setOwnership",
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
        "internalType": "address",
        "name": "_tapper",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_currency",
        "type": "uint256"
      }
    ],
    "name": "tap",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "project",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "number",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "previous",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "link",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "target",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "currency",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "total",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "start",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "duration",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tappedTarget",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tappedTotal",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "reserved",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "donationRecipient",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "donationAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "fee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "weight",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "discountRate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "bondingCurveRate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "configured",
            "type": "uint256"
          },
          {
            "internalType": "contract IBudgetBallot",
            "name": "ballot",
            "type": "address"
          }
        ],
        "internalType": "struct Budget.Data",
        "name": "budget",
        "type": "tuple"
      },
      {
        "internalType": "uint256",
        "name": "convertedEthAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "overflow",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];