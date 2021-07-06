/* eslint no-use-before-define: "warn" */
const { ethers } = require("hardhat");
const chalk = require("chalk");
const fs = require("fs");
const { utils } = require("ethers");
const R = require("ramda");
const ethUsdPriceFeed = require("../constants/eth_usd_price_feed");
const publish = require("./publish");
/* eslint no-use-before-define: "warn" */

const network = process.env.HARDHAT_NETWORK;

// ------ utils -------

// abi encodes contract arguments
// useful when you want to manually verify the contracts
// for example, on Etherscan
const abiEncodeArgs = (deployed, contractArgs) => {
  // not writing abi encoded args if this does not pass
  if (
    !contractArgs ||
    !deployed ||
    !R.hasPath(["interface", "deploy"], deployed)
  ) {
    return "";
  }
  const encoded = utils.defaultAbiCoder.encode(
    deployed.interface.deploy.inputs,
    contractArgs
  );
  return encoded;
};

const deploy = async (contractName, _args) => {
  console.log("🚀", chalk.cyan(contractName), "deploying...");

  const contractArgs = _args || [];
  const contractArtifacts = await ethers.getContractFactory(contractName);
  const deployed = await contractArtifacts.deploy(...contractArgs);
  await deployed.deployTransaction.wait();

  const encoded = abiEncodeArgs(deployed, contractArgs);
  fs.writeFileSync(`artifacts/${contractName}.address`, deployed.address);

  console.log(
    chalk.green("   Done!"),
    "Deployed at:",
    chalk.magenta(deployed.address)
  );

  if (!encoded || encoded.length <= 2) return deployed;
  fs.writeFileSync(`artifacts/${contractName}.args`, encoded.slice(2));

  return deployed;
};

const main = async () => {
  const startBlock = await ethers.provider.getBlockNumber();

  console.log("Start block:", startBlock);

  const ethUsdAddr = ethUsdPriceFeed(network);
  const prices = await deploy("Prices");
  const operatorStore = await deploy("OperatorStore");
  const projects = await deploy("Projects", [operatorStore.address]);
  const terminalDirectory = await deploy("TerminalDirectory", [
    projects.address,
    operatorStore.address
  ]);
  const fundingCycles = await deploy("FundingCycles", [
    terminalDirectory.address
  ]);
  const ticketBooth = await deploy("TicketBooth", [
    projects.address,
    operatorStore.address,
    terminalDirectory.address
  ]);
  const modStore = await deploy("ModStore", [
    projects.address,
    operatorStore.address,
    terminalDirectory.address
  ]);

  const governance = await deploy("Governance", [1, terminalDirectory.address]);

  const juicer = await deploy("Juicer", [
    projects.address,
    fundingCycles.address,
    ticketBooth.address,
    operatorStore.address,
    modStore.address,
    prices.address,
    terminalDirectory.address,
    governance.address
  ]);

  const ballot = await deploy("FundingCycleBallot", []);

  const blockGasLimit = 9000000;

  try {
    const PricesFactory = await ethers.getContractFactory("Prices");
    const GovernanceFactory = await ethers.getContractFactory("Governance");
    const JuicerFactory = await ethers.getContractFactory("Juicer");

    const attachedPrices = await PricesFactory.attach(prices.address);
    const attachedGovernance = await GovernanceFactory.attach(
      governance.address
    );
    const attachedJuicer = await JuicerFactory.attach(juicer.address);

    const callContractIcon = "🛰  ";
    console.log(callContractIcon + "Setting the prices owner");
    await attachedPrices.transferOwnership(governance.address, {
      gasLimit: blockGasLimit
    });

    // Add a production price feed if there is a reference to one.
    if (ethUsdAddr) {
      console.log(
        callContractIcon + "Adding ETH/USD price feed to the funding cycles"
      );
      await attachedGovernance.addPriceFeed(prices.address, ethUsdAddr, 1, {
        gasLimit: blockGasLimit
      });
      // Otherwise deploy a static local price feed.
    } else {
      const feed = await deploy("ExampleETHUSDPriceFeed", []);
      await attachedGovernance.addPriceFeed(prices.address, feed.address, 1, {
        gasLimit: blockGasLimit
      });
    }

    // TODO set the owner of the admin contract.
    // await attachedJuicer.transferOwnership(admin.address, {
    //   gasLimit: blockGasLimit
    // });

    console.log(callContractIcon + "Configuring governance's budget");

    await attachedJuicer.deploy(
      governance.address,
      utils.formatBytes32String("juice"),
      "QmSFLBMjeuHLo5hrh7oGRNYNVasCN66LYEELrDyLV8qTQt",
      {
        target: "0x21E19E0C9BAB2400000",
        currency: 1,
        duration: 30, // 30 days
        cycleLimit: 0,
        discountRate: 190,
        ballot: ballot.address
      },
      {
        bondingCurveRate: 140,
        reservedRate: 100,
        reconfigurationBondingCurveRate: 200
      },
      [],
      [],
      {
        gasLimit: blockGasLimit
      }
    );
  } catch (e) {
    console.log("Failed to set up environment: ", e);
  }

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
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
