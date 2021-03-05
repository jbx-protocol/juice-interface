module.exports = (network) =>{ 
  switch (network) {
    case "mainnet": return "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
    case "kovan": return "0x9326BFA02ADD2366b30bacB125260Af641031331";
    case "optimism": return "";
  }
 };
