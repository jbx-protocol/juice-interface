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
            "internalType": "uint256",
            "name": "projectId",
            "type": "uint256"
          },
          {
            "internalType": "address payable",
            "name": "beneficiary",
            "type": "address"
          },
          {
            "internalType": "uint16",
            "name": "percent",
            "type": "uint16"
          },
          {
            "internalType": "string",
            "name": "note",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "preferConverted",
            "type": "bool"
          }
        ],
        "indexed": false,
        "internalType": "struct PaymentMod[]",
        "name": "mods",
        "type": "tuple[]"
      }
    ],
    "name": "SetPaymentMods",
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
            "internalType": "uint16",
            "name": "percent",
            "type": "uint16"
          },
          {
            "internalType": "bool",
            "name": "preferConverted",
            "type": "bool"
          }
        ],
        "indexed": false,
        "internalType": "struct TicketMod[]",
        "name": "mods",
        "type": "tuple[]"
      }
    ],
    "name": "SetTicketMods",
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
    "name": "allPaymentMods",
    "outputs": [
      {
        "components": [
          {
            "internalType": "contract IModAllocator",
            "name": "allocator",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "projectId",
            "type": "uint256"
          },
          {
            "internalType": "address payable",
            "name": "beneficiary",
            "type": "address"
          },
          {
            "internalType": "uint16",
            "name": "percent",
            "type": "uint16"
          },
          {
            "internalType": "string",
            "name": "note",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "preferConverted",
            "type": "bool"
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
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_projectId",
        "type": "uint256"
      }
    ],
    "name": "allTicketMods",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address payable",
            "name": "beneficiary",
            "type": "address"
          },
          {
            "internalType": "uint16",
            "name": "percent",
            "type": "uint16"
          },
          {
            "internalType": "bool",
            "name": "preferConverted",
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
        "internalType": "uint256",
        "name": "_projectId",
        "type": "uint256"
      },
      {
        "internalType": "enum IModStore.ModKind[]",
        "name": "_kinds",
        "type": "uint8[]"
      },
      {
        "internalType": "address payable[]",
        "name": "_beneficiaries",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "_percents",
        "type": "uint256[]"
      },
      {
        "internalType": "contract IModAllocator[]",
        "name": "_allocators",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "_forProjectIds",
        "type": "uint256[]"
      },
      {
        "internalType": "string[]",
        "name": "_notes",
        "type": "string[]"
      },
      {
        "internalType": "bool[]",
        "name": "_preferConvertedTickets",
        "type": "bool[]"
      }
    ],
    "name": "setMods",
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
        "internalType": "contract IModAllocator[]",
        "name": "_allocators",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "_forProjectIds",
        "type": "uint256[]"
      },
      {
        "internalType": "address payable[]",
        "name": "_beneficiaries",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "_percents",
        "type": "uint256[]"
      },
      {
        "internalType": "string[]",
        "name": "_notes",
        "type": "string[]"
      },
      {
        "internalType": "bool[]",
        "name": "_preferConvertedTickets",
        "type": "bool[]"
      }
    ],
    "name": "setPaymentMods",
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
        "internalType": "address payable[]",
        "name": "_beneficiaries",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "_percents",
        "type": "uint256[]"
      },
      {
        "internalType": "bool[]",
        "name": "_preferConvertedTickets",
        "type": "bool[]"
      }
    ],
    "name": "setTicketMods",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];