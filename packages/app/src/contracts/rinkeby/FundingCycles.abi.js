module.exports = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
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
        "name": "_bondingCurveRate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_reserved",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_reconfigurationDelay",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_fee",
        "type": "uint256"
      }
    ],
    "name": "configure",
    "outputs": [
      {
        "components": [
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
            "name": "currency",
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
            "internalType": "uint256",
            "name": "eligibleAfter",
            "type": "uint256"
          }
        ],
        "internalType": "struct FundingCycle.Data",
        "name": "fundingCycle",
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
            "name": "currency",
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
            "internalType": "uint256",
            "name": "eligibleAfter",
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
            "name": "currency",
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
            "internalType": "uint256",
            "name": "eligibleAfter",
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
            "name": "currency",
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
            "internalType": "uint256",
            "name": "eligibleAfter",
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
      },
      {
        "internalType": "uint256",
        "name": "_currency",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_currentOverflow",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_ethPrice",
        "type": "uint256"
      }
    ],
    "name": "tap",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "convertedEthAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "feeAmount",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];