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

const terminalDirectory = "0x46C9999A2EDCD5aA177ed7E8af90c68b7d75Ba46";
const ticketBooth = "0xee2eBCcB7CDb34a8A822b589F9E8427C24351bfc";

const main = async () => {
  if (network !== "mainnet") {
    throw "⚠️  This script should only be used when deploying to mainnet";
  }

  const startBlock = await ethers.provider.getBlockNumber();

  console.log("Start block:", startBlock);

  console.log("Deploying:", chalk.yellow("ProxyPaymentAddressManager"), "\n");

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
