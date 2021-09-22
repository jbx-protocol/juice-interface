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
      },
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
        "internalType": "uint256",
        "name": "configuration",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "bool",
            "name": "preferUnstaked",
            "type": "bool"
          },
          {
            "internalType": "uint16",
            "name": "percent",
            "type": "uint16"
          },
          {
            "internalType": "uint48",
            "name": "lockedUntil",
            "type": "uint48"
          },
          {
            "internalType": "address payable",
            "name": "beneficiary",
            "type": "address"
          },
          {
            "internalType": "contract IModAllocator",
            "name": "allocator",
            "type": "address"
          },
          {
            "internalType": "uint56",
            "name": "projectId",
            "type": "uint56"
          }
        ],
        "indexed": false,
        "internalType": "struct PayoutMod",
        "name": "mods",
        "type": "tuple"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "caller",
        "type": "address"
      }
    ],
    "name": "SetPayoutMod",
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
        "internalType": "uint256",
        "name": "configuration",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "bool",
            "name": "preferUnstaked",
            "type": "bool"
          },
          {
            "internalType": "uint16",
            "name": "percent",
            "type": "uint16"
          },
          {
            "internalType": "uint48",
            "name": "lockedUntil",
            "type": "uint48"
          },
          {
            "internalType": "address payable",
            "name": "beneficiary",
            "type": "address"
          }
        ],
        "indexed": false,
        "internalType": "struct TicketMod",
        "name": "mods",
        "type": "tuple"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "caller",
        "type": "address"
      }
    ],
    "name": "SetTicketMod",
    "type": "event"
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
        "internalType": "uint256",
        "name": "_projectId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_configuration",
        "type": "uint256"
      }
    ],
    "name": "payoutModsOf",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bool",
            "name": "preferUnstaked",
            "type": "bool"
          },
          {
            "internalType": "uint16",
            "name": "percent",
            "type": "uint16"
          },
          {
            "internalType": "uint48",
            "name": "lockedUntil",
            "type": "uint48"
          },
          {
            "internalType": "address payable",
            "name": "beneficiary",
            "type": "address"
          },
          {
            "internalType": "contract IModAllocator",
            "name": "allocator",
            "type": "address"
          },
          {
            "internalType": "uint56",
            "name": "projectId",
            "type": "uint56"
          }
        ],
        "internalType": "struct PayoutMod[]",
        "name": "",
        "type": "tuple[]"
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
        "internalType": "uint256",
        "name": "_projectId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_configuration",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "bool",
            "name": "preferUnstaked",
            "type": "bool"
          },
          {
            "internalType": "uint16",
            "name": "percent",
            "type": "uint16"
          },
          {
            "internalType": "uint48",
            "name": "lockedUntil",
            "type": "uint48"
          },
          {
            "internalType": "address payable",
            "name": "beneficiary",
            "type": "address"
          },
          {
            "internalType": "contract IModAllocator",
            "name": "allocator",
            "type": "address"
          },
          {
            "internalType": "uint56",
            "name": "projectId",
            "type": "uint56"
          }
        ],
        "internalType": "struct PayoutMod[]",
        "name": "_mods",
        "type": "tuple[]"
      }
    ],
    "name": "setPayoutMods",
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
        "name": "_configuration",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "bool",
            "name": "preferUnstaked",
            "type": "bool"
          },
          {
            "internalType": "uint16",
            "name": "percent",
            "type": "uint16"
          },
          {
            "internalType": "uint48",
            "name": "lockedUntil",
            "type": "uint48"
          },
          {
            "internalType": "address payable",
            "name": "beneficiary",
            "type": "address"
          }
        ],
        "internalType": "struct TicketMod[]",
        "name": "_mods",
        "type": "tuple[]"
      }
    ],
    "name": "setTicketMods",
    "outputs": [],
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
        "name": "_configuration",
        "type": "uint256"
      }
    ],
    "name": "ticketModsOf",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bool",
            "name": "preferUnstaked",
            "type": "bool"
          },
          {
            "internalType": "uint16",
            "name": "percent",
            "type": "uint16"
          },
          {
            "internalType": "uint48",
            "name": "lockedUntil",
            "type": "uint48"
          },
          {
            "internalType": "address payable",
            "name": "beneficiary",
            "type": "address"
          }
        ],
        "internalType": "struct TicketMod[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];