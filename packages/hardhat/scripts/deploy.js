/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { ethers } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");
const { DAI } = require("../constants/dai");

const main = async () => {
  console.log("\n\n 📡 Deploying to " + process.env.HARDHAT_NETWORK + " ...\n");

  const isMainnet = process.env.HARDHAT_NETWORK === "mainnet";

  const token = isMainnet ? undefined : await deploy("Token");
  const budgetStore = await deploy("BudgetStore");
  const ticketStore = await deploy("TicketStore");

  const juicer = await deploy("Juicer", [
    budgetStore.address,
    ticketStore.address,
    5,
    isMainnet ? DAI : token.address
  ]);

  const staker = await deploy("TimelockStaker");
  const budgetBallot = await deploy("BudgetBallot", [
    juicer.address,
    staker.address
  ]);

  const admin = await deploy("Admin", [
    juicer.address,
    "Juice Tickets",
    "tJUICE"
  ]);

  try {
    const TicketStoreFactory = await ethers.getContractFactory("TicketStore");
    const BudgetStoreFactory = await ethers.getContractFactory("BudgetStore");
    const AdminFactory = await ethers.getContractFactory("Admin");
    const StakerFactory = await ethers.getContractFactory("TimelockStaker");
    const JuicerFactory = await ethers.getContractFactory("Juicer");

    const attachedTicketStore = await TicketStoreFactory.attach(
      ticketStore.address
    );
    const attachedBudgetStore = await BudgetStoreFactory.attach(
      budgetStore.address
    );
    const attachedAdmin = await AdminFactory.attach(admin.address);
    const attachedStaker = await StakerFactory.attach(staker.address);
    const attachedJuicer = await JuicerFactory.attach(juicer.address);

    await attachedTicketStore.setOwnership(admin.address, {
      gasLimit: 3000000
    });
    await attachedBudgetStore.setOwnership(admin.address, {
      gasLimit: 3000000
    });
    await attachedAdmin.grantAdmin(budgetStore.address, juicer.address, {
      gasLimit: 3000000
    });
    await attachedAdmin.grantAdmin(ticketStore.address, juicer.address, {
      gasLimit: 3000000
    });
    await attachedAdmin.grantAdmin(budgetStore.address, budgetBallot.address, {
      gasLimit: 3000000
    });
    await attachedJuicer.setAdmin(admin.address, {
      gasLimit: 3000000
    });
    await attachedAdmin.issueTickets({
      gasLimit: 3000000
    });

    // Make this Ballot the timelock controller of the staker contract.
    await attachedStaker.setController(budgetBallot.address, {
      gasLimit: 3000000
    });
  } catch (e) {
    console.log("Failed to establish admin contract ownership: ", e);
  }

  console.log(
    " 💾  Artifacts (address, abi, and args) saved to: ",
    chalk.blue("packages/hardhat/artifacts/"),
    "\n\n"
  );
};

const deploy = async (contractName, _args) => {
  console.log(` 🛰  Deploying: ${contractName}`);

  const contractArgs = _args || [];
  const contractArtifacts = await ethers.getContractFactory(contractName);
  const deployed = await contractArtifacts.deploy(...contractArgs);
  const encoded = abiEncodeArgs(deployed, contractArgs);
  fs.writeFileSync(`artifacts/${contractName}.address`, deployed.address);

  console.log(
    " 📄",
    chalk.cyan(contractName),
    "deployed to:",
    chalk.magenta(deployed.address)
  );

  if (!encoded || encoded.length <= 2) return deployed;
  fs.writeFileSync(`artifacts/${contractName}.args`, encoded.slice(2));

  return deployed;
};

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

// checks if it is a Solidity file
const isSolidity = fileName =>
  fileName.indexOf(".sol") >= 0 && fileName.indexOf(".swp") < 0;

const readArgsFile = contractName => {
  let args = [];
  try {
    const argsFile = `./contracts/${contractName}.args`;
    if (!fs.existsSync(argsFile)) return args;
    args = JSON.parse(fs.readFileSync(argsFile));
  } catch (e) {
    console.log(e);
  }
  return args;
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
