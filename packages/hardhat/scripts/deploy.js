/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { config, ethers } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");

const uniswapV2Router = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

const main = async () => {
  console.log("\n\n 📡 Deploying...\n");

  const token = await deploy("Token");

  const budgetStore = await deploy("BudgetStore");
  const ticketStore = await deploy("TicketStore");
  const juicer = await deploy("Juicer", [
    budgetStore.address,
    ticketStore.address,
    staking.address,
    5,
    [token.address],
    uniswapV2Router
  ]);
  const minter = await deploy("Minter", [controller.address]);
  const maintainer = await deploy("Maintainer", [controller.address]);

  const staker = await deploy("TimelockStaker");
  const budgetBallot = await deploy("BudgetBallot", [juicer.address, staker.address]);

  const admin = await deploy("Admin", [
    juicer.address,
     minter.address, maintainer.address,
     budgetBallot.address,
    "Juice Tickets",
    "tJUICE",
    token.address,
    uniswapV2Router
  ]);

  try {
    const BudgetStoreFactory = await ethers.getContractFactory("BudgetStore");
    const TicketStoreFactory = await ethers.getContractFactory("TicketStore");
    const AdminFactory = await ethers.getContractFactory("Admin");

    const attachedBudgetStore = await BudgetStoreFactory.attach(budgetStore.address);
    const attachedTicketStore = await TicketStoreFactory.attach(ticketStore.address);
    const attachedAdmin = await AdminFactory.attach(admin.address);

    attachedBudgetStore.claimOwnership(admin.address);
    attachedTicketStore.claimOwnership(admin.address);
    attachedAdmin.appointJuicer(juicer.address);
    attachedAdmin.issueTickets();

  } catch (e) {
    console.log("EE: ", e);
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
