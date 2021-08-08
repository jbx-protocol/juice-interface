// Script to deploy ProxyAddressManager to mainnet.
//
// Usage:
// cd packages/hardhat
// npx hardhat run scripts/deployProxyPaymentAddressManager.js --network mainnet

/* eslint no-use-before-define: "warn" */
const chalk = require("chalk");
const publish = require("./publish");
const juice = require("./utils");

/* eslint no-use-before-define: "warn" */

const network = process.env.HARDHAT_NETWORK;

const getTerminalDirectory = () => {
  if (network === "rinkeby") {
    return "0x5d03dA1Ec58cf319c4fDbf2E3fE3DDcd887ef9aD";
  }
  if (network === "mainnet") {
    return "0x46C9999A2EDCD5aA177ed7E8af90c68b7d75Ba46";
  }
};

const getTicketBooth = () => {
  if (network === "rinkeby") {
    return "0x04f228B6654253c63DBcE4c60391a8eF3c43c861";
  }
  if (network === "mainnet") {
    return "0xee2eBCcB7CDb34a8A822b589F9E8427C24351bfc";
  }
};

const main = async () => {
  // TODO: this kind of logic could be generalized.
  // We should be able to get a deployed address of a contract for a given network.
  if (network !== "mainnet" && network !== "rinkeby") {
    throw "⚠️  This script should only be used when deploying to mainnet or rinkeby";
  }
  const startBlock = await ethers.provider.getBlockNumber();
  console.log("Start block:", startBlock);
  console.log("Deploying:", chalk.yellow("ProxyPaymentAddressManager"), "\n");

  const terminalDirectory = getTerminalDirectory();
  const ticketBooth = getTicketBooth();

  console.log("TerminalDirectory:", chalk.green(terminalDirectory));
  console.log("TicketBooth:", chalk.green(ticketBooth), "\n");

  await juice.deploy("ProxyPaymentAddressManager", [
    terminalDirectory,
    ticketBooth,
  ]);
  console.log("\n");
  console.log(
    "⚡️ Contract artifacts saved to:",
    chalk.yellow("packages/hardhat/artifacts/"),
    "\n"
  );
  await publish(startBlock, "ProxyPaymentAddressManager");
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
