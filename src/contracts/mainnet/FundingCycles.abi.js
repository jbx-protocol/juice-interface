module.exports = [
  {
    "inputs": [
      {
        "internalType": "contract ITerminalDirectory",
        "name": "_terminalDirectory",
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
        "name": "prod1",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "denominator",
        "type": "uint256"
      }
    ],
    "name": "PRBMath__MulDivOverflow",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "fundingCycleId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "reconfigured",
        "type": "uint256"
      },
      {
        "components": [
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
            "name": "duration",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "cycleLimit",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "discountRate",
            "type": "uint256"
          },
          {
            "internalType": "contract IFundingCycleBallot",
            "name": "ballot",
            "type": "address"
          }
        ],
        "indexed": false,
        "internalType": "struct FundingCycleProperties",
        "name": "_properties",
        "type": "tuple"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "metadata",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "caller",
        "type": "address"
      }
    ],
    "name": "Configure",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "fundingCycleId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "number",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "previous",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "weight",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "start",
        "type": "uint256"
      }
    ],
    "name": "Init",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "fundingCycleId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "projectId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newTappedAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "caller",
        "type": "address"
      }
    ],
    "name": "Tap",
    "type": "event"
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
    "inputs": [],
    "name": "MAX_CYCLE_LIMIT",
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
        "name": "_projectId",
        "type": "uint256"
      },
      {
        "components": [
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
            "name": "duration",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "cycleLimit",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "discountRate",
            "type": "uint256"
          },
          {
            "internalType": "contract IFundingCycleBallot",
            "name": "ballot",
            "type": "address"
          }
        ],
        "internalType": "struct FundingCycleProperties",
        "name": "_properties",
        "type": "tuple"
      },
      {
        "internalType": "uint256",
        "name": "_metadata",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_fee",
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
            "name": "basedOn",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "configured",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "cycleLimit",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "weight",
            "type": "uint256"
          },
          {
            "internalType": "contract IFundingCycleBallot",
            "name": "ballot",
            "type": "address"
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
            "name": "fee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "discountRate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tapped",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "metadata",
            "type": "uint256"
          }
        ],
        "internalType": "struct FundingCycle",
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
        "name": "_projectId",
        "type": "uint256"
      }
    ],
    "name": "currentBallotStateOf",
    "outputs": [
      {
        "internalType": "enum BallotState",
        "name": "",
        "type": "uint8"
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
    "name": "currentOf",
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
            "name": "basedOn",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "configured",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "cycleLimit",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "weight",
            "type": "uint256"
          },
          {
            "internalType": "contract IFundingCycleBallot",
            "name": "ballot",
            "type": "address"
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
            "name": "fee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "discountRate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tapped",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "metadata",
            "type": "uint256"
          }
        ],
        "internalType": "struct FundingCycle",
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
            "name": "basedOn",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "configured",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "cycleLimit",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "weight",
            "type": "uint256"
          },
          {
            "internalType": "contract IFundingCycleBallot",
            "name": "ballot",
            "type": "address"
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
            "name": "fee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "discountRate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tapped",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "metadata",
            "type": "uint256"
          }
        ],
        "internalType": "struct FundingCycle",
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
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "latestIdOf",
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
        "name": "_projectId",
        "type": "uint256"
      }
    ],
    "name": "queuedOf",
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
            "name": "basedOn",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "configured",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "cycleLimit",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "weight",
            "type": "uint256"
          },
          {
            "internalType": "contract IFundingCycleBallot",
            "name": "ballot",
            "type": "address"
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
            "name": "fee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "discountRate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tapped",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "metadata",
            "type": "uint256"
          }
        ],
        "internalType": "struct FundingCycle",
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
            "name": "basedOn",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "configured",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "cycleLimit",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "weight",
            "type": "uint256"
          },
          {
            "internalType": "contract IFundingCycleBallot",
            "name": "ballot",
            "type": "address"
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
            "name": "fee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "discountRate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tapped",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "metadata",
            "type": "uint256"
          }
        ],
        "internalType": "struct FundingCycle",
        "name": "fundingCycle",
        "type": "tuple"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "terminalDirectory",
    "outputs": [
      {
        "internalType": "contract ITerminalDirectory",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];