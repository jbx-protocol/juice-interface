module.exports = (network) => {
  switch (network) {
    case "mainnet":
      return "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
    case "kovan":
      return "0xd0a1e359811322d97991e03f863a0c30c2cf029c";
    case "rinkeby":
      return "0xc778417e063141139fce010982780140aa0cd5ab";
    case "optimism":
      return "0x4200000000000000000000000000000000000006";
  }
};
