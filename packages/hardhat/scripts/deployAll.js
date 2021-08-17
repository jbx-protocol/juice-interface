/* eslint no-use-before-define: "warn" */
const { ethers } = require("hardhat");
const chalk = require("chalk");
const fs = require("fs");
const { utils } = require("ethers");
const R = require("ramda");
const ethUsdPriceFeed = require("../constants/eth_usd_price_feed");
const publish = require("./publish");
const juice = require("./utils");

/* eslint no-use-before-define: "warn" */

const network = process.env.HARDHAT_NETWORK;

const main = async () => {
  const startBlock = await ethers.provider.getBlockNumber();

  console.log("Start block:", startBlock);

  const ethUsdAddr = ethUsdPriceFeed(network);
  const prices = await juice.deploy("Prices");
  const operatorStore = await juice.deploy("OperatorStore");
  const projects = await juice.deploy("Projects", [operatorStore.address]);
  const terminalDirectory = await juice.deploy("TerminalDirectory", [
    projects.address,
    operatorStore.address,
  ]);
  const fundingCycles = await juice.deploy("FundingCycles", [
    terminalDirectory.address,
  ]);
  const ticketBooth = await juice.deploy("TicketBooth", [
    projects.address,
    operatorStore.address,
    terminalDirectory.address,
  ]);
  const modStore = await juice.deploy("ModStore", [
    projects.address,
    operatorStore.address,
    terminalDirectory.address,
  ]);
  await juice.deploy("ProxyPaymentAddressManager", [
    terminalDirectory.address,
    ticketBooth.address,
  ]);
  await juice.deploy("TokenRepresentationProxy", [
    ticketBooth.address,
    1,
    "JBX Proxy",
    "JBXPROXY",
  ]);

  const governance = await juice.deploy("Governance", [
    1,
    terminalDirectory.address,
  ]);

  const terminalV1 = await juice.deploy("TerminalV1", [
    projects.address,
    fundingCycles.address,
    ticketBooth.address,
    operatorStore.address,
    modStore.address,
    prices.address,
    terminalDirectory.address,
    governance.address,
  ]);

  const ballot = await juice.deploy("Active7DaysFundingCycleBallot", []);

  const PricesFactory = await ethers.getContractFactory("Prices");
  const GovernanceFactory = await ethers.getContractFactory("Governance");
  const TerminalV1Factory = await ethers.getContractFactory("TerminalV1");

  const attachedPrices = await PricesFactory.attach(prices.address);
  const attachedGovernance = await GovernanceFactory.attach(governance.address);
  const attachedTerminalV1 = await TerminalV1Factory.attach(terminalV1.address);

  const callContractIcon = "🛰  ";
  console.log(callContractIcon + "Setting the prices owner");
  await attachedPrices.transferOwnership(governance.address);

  // Add a production price feed if there is a reference to one.
  if (ethUsdAddr) {
    console.log(
      callContractIcon + "Adding ETH/USD price feed to the funding cycles"
    );
    await attachedGovernance.addPriceFeed(prices.address, ethUsdAddr, 1, {
      gasLimit: 6000000,
    });
    // Otherwise deploy a static local price feed.
  } else {
    const feed = await juice.deploy("ExampleETHUSDPriceFeed", []);
    await attachedGovernance.addPriceFeed(prices.address, feed.address, 1);
  }

  console.log(
    callContractIcon + "Transfering ownership of governance to the multisig"
  );

  // Transfer ownership of governance to the multisig.
  await attachedGovernance.transferOwnership(juice.multisigAddress);

  console.log(callContractIcon + "Configuring governance's budget");

  await attachedTerminalV1.deploy(
    governance.address,
    utils.formatBytes32String("juicebox"),
    "QmQTsEPAx1caPL5n6QQyngpBR7GdCQZFeh8z15idAYo9hr",
    {
      target: "0x43A69CA064CD09C0000",
      currency: 1,
      duration: 30, // 30 days
      cycleLimit: 0,
      discountRate: 200,
      ballot: ballot.address,
    },
    {
      bondingCurveRate: 120,
      reservedRate: 20,
      reconfigurationBondingCurveRate: 120,
    },
    [],
    [],
    {
      gasLimit: 6000000,
    }
  );

  console.log("\n");

  console.log(
    "⚡️ All contract artifacts saved to:",
    chalk.yellow("packages/hardhat/artifacts/"),
    "\n"
  );

  console.log(
    chalk.green(" ✔ Deployed for network:"),
    process.env.HARDHAT_NETWORK,
    "\n"
  );

  await publish(startBlock);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
