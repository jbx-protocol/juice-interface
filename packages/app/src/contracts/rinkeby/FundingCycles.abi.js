module.exports = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "BASE_WEIGHT",
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
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_projectId",
        "type": "uint256"
      },
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
        "internalType": "uint256",
        "name": "_discountRate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_fee",
        "type": "uint256"
      },
      {
        "internalType": "contract IFundingCycleBallot",
        "name": "_ballot",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_metadata",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_configureActiveFundingCycle",
        "type": "bool"
      }
    ],
    "name": "configure",
    "outputs": [
      {
        "components": [
          {
            "internalType": "contract IFundingCycleBallot",
            "name": "ballot",
            "type": "address"
          },
          {
            "internalType": "contract IFundingCycleBallot",
            "name": "currentBallot",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "currency",
            "type": "uint8"
          },
          {
            "internalType": "uint16",
            "name": "fee",
            "type": "uint16"
          },
          {
            "internalType": "uint16",
            "name": "discountRate",
            "type": "uint16"
          },
          {
            "internalType": "uint32",
            "name": "duration",
            "type": "uint32"
          },
          {
            "internalType": "uint48",
            "name": "start",
            "type": "uint48"
          },
          {
            "internalType": "uint48",
            "name": "configured",
            "type": "uint48"
          },
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "projectId",
            "type": "uint256"
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
            "internalType": "uint256",
            "name": "target",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tapped",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "weight",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "metadata",
            "type": "uint256"
          }
        ],
        "internalType": "struct FundingCycle.Data",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "count",
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
        "name": "_fundingCycleId",
        "type": "uint256"
      }
    ],
    "name": "get",
    "outputs": [
      {
        "components": [
          {
            "internalType": "contract IFundingCycleBallot",
            "name": "ballot",
            "type": "address"
          },
          {
            "internalType": "contract IFundingCycleBallot",
            "name": "currentBallot",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "currency",
            "type": "uint8"
          },
          {
            "internalType": "uint16",
            "name": "fee",
            "type": "uint16"
          },
          {
            "internalType": "uint16",
            "name": "discountRate",
            "type": "uint16"
          },
          {
            "internalType": "uint32",
            "name": "duration",
            "type": "uint32"
          },
          {
            "internalType": "uint48",
            "name": "start",
            "type": "uint48"
          },
          {
            "internalType": "uint48",
            "name": "configured",
            "type": "uint48"
          },
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "projectId",
            "type": "uint256"
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
            "internalType": "uint256",
            "name": "target",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tapped",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "weight",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "metadata",
            "type": "uint256"
          }
        ],
        "internalType": "struct FundingCycle.Data",
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
        "internalType": "uint256",
        "name": "_projectId",
        "type": "uint256"
      }
    ],
    "name": "getCurrent",
    "outputs": [
      {
        "components": [
          {
            "internalType": "contract IFundingCycleBallot",
            "name": "ballot",
            "type": "address"
          },
          {
            "internalType": "contract IFundingCycleBallot",
            "name": "currentBallot",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "currency",
            "type": "uint8"
          },
          {
            "internalType": "uint16",
            "name": "fee",
            "type": "uint16"
          },
          {
            "internalType": "uint16",
            "name": "discountRate",
            "type": "uint16"
          },
          {
            "internalType": "uint32",
            "name": "duration",
            "type": "uint32"
          },
          {
            "internalType": "uint48",
            "name": "start",
            "type": "uint48"
          },
          {
            "internalType": "uint48",
            "name": "configured",
            "type": "uint48"
          },
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "projectId",
            "type": "uint256"
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
            "internalType": "uint256",
            "name": "target",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tapped",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "weight",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "metadata",
            "type": "uint256"
          }
        ],
        "internalType": "struct FundingCycle.Data",
        "name": "fundingCycle",
        "type": "tuple"
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
      }
    ],
    "name": "getQueued",
    "outputs": [
      {
        "components": [
          {
            "internalType": "contract IFundingCycleBallot",
            "name": "ballot",
            "type": "address"
          },
          {
            "internalType": "contract IFundingCycleBallot",
            "name": "currentBallot",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "currency",
            "type": "uint8"
          },
          {
            "internalType": "uint16",
            "name": "fee",
            "type": "uint16"
          },
          {
            "internalType": "uint16",
            "name": "discountRate",
            "type": "uint16"
          },
          {
            "internalType": "uint32",
            "name": "duration",
            "type": "uint32"
          },
          {
            "internalType": "uint48",
            "name": "start",
            "type": "uint48"
          },
          {
            "internalType": "uint48",
            "name": "configured",
            "type": "uint48"
          },
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "projectId",
            "type": "uint256"
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
            "internalType": "uint256",
            "name": "target",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tapped",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "weight",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "metadata",
            "type": "uint256"
          }
        ],
        "internalType": "struct FundingCycle.Data",
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
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "latestId",
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
        "name": "_projectId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "tap",
    "outputs": [
      {
        "components": [
          {
            "internalType": "contract IFundingCycleBallot",
            "name": "ballot",
            "type": "address"
          },
          {
            "internalType": "contract IFundingCycleBallot",
            "name": "currentBallot",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "currency",
            "type": "uint8"
          },
          {
            "internalType": "uint16",
            "name": "fee",
            "type": "uint16"
          },
          {
            "internalType": "uint16",
            "name": "discountRate",
            "type": "uint16"
          },
          {
            "internalType": "uint32",
            "name": "duration",
            "type": "uint32"
          },
          {
            "internalType": "uint48",
            "name": "start",
            "type": "uint48"
          },
          {
            "internalType": "uint48",
            "name": "configured",
            "type": "uint48"
          },
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "projectId",
            "type": "uint256"
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
            "internalType": "uint256",
            "name": "target",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tapped",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "weight",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "metadata",
            "type": "uint256"
          }
        ],
        "internalType": "struct FundingCycle.Data",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];