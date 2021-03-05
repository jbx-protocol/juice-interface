module.exports = (network) =>{ 
  switch (network) {
    case "mainnet": return "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
    case "kovan": return "0xd0a1e359811322d97991e03f863a0c30c2cf029c";
    case "optimism": return "0x4200000000000000000000000000000000000006";
  }
 };
