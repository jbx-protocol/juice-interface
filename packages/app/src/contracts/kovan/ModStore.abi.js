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
        "components": [
          {
            "internalType": "contract IModAllocator",
            "name": "allocator",
            "type": "address"
          },
          {
            "internalType": "address payable",
            "name": "beneficiary",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "percent",
            "type": "uint8"
          },
          {
            "internalType": "bool",
            "name": "preferUnstaked",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "projectId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "note",
            "type": "string"
          }
        ],
        "indexed": false,
        "internalType": "struct PaymentMod",
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
    "name": "SetPaymentMod",
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
        "components": [
          {
            "internalType": "address payable",
            "name": "beneficiary",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "percent",
            "type": "uint8"
          },
          {
            "internalType": "bool",
            "name": "preferUnstaked",
            "type": "bool"
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
      }
    ],
    "name": "paymentMods",
    "outputs": [
      {
        "components": [
          {
            "internalType": "contract IModAllocator",
            "name": "allocator",
            "type": "address"
          },
          {
            "internalType": "address payable",
            "name": "beneficiary",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "percent",
            "type": "uint8"
          },
          {
            "internalType": "bool",
            "name": "preferUnstaked",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "projectId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "note",
            "type": "string"
          }
        ],
        "internalType": "struct PaymentMod[]",
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
        "components": [
          {
            "internalType": "contract IModAllocator",
            "name": "allocator",
            "type": "address"
          },
          {
            "internalType": "address payable",
            "name": "beneficiary",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "percent",
            "type": "uint8"
          },
          {
            "internalType": "bool",
            "name": "preferUnstaked",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "projectId",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "note",
            "type": "string"
          }
        ],
        "internalType": "struct PaymentMod[]",
        "name": "_mods",
        "type": "tuple[]"
      }
    ],
    "name": "setPaymentMods",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "setPaymentModsPermissionIndex",
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
            "internalType": "address payable",
            "name": "beneficiary",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "percent",
            "type": "uint8"
          },
          {
            "internalType": "bool",
            "name": "preferUnstaked",
            "type": "bool"
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
    "name": "setTicketModsPermissionIndex",
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
    "name": "ticketMods",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address payable",
            "name": "beneficiary",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "percent",
            "type": "uint8"
          },
          {
            "internalType": "bool",
            "name": "preferUnstaked",
            "type": "bool"
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