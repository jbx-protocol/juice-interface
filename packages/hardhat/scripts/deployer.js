/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { ethers } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");

module.exports = async (wethAddr, ethUsdAddr) => {
  const prices = await deploy("Prices");
  const operatorStore = await deploy("OperatorStore");
  const projects = await deploy("Projects", [operatorStore.address]);
  const fundingCycles = await deploy("FundingCycles");
  const tickets = await deploy("Tickets", [
    projects.address,
    operatorStore.address,
  ]);
  const modStore = await deploy("ModStore", [
    projects.address,
    operatorStore.address,
  ]);

  const governance = await deploy("Governance", [1]);

  const juicer = await deploy("Juicer", [
    projects.address,
    fundingCycles.address,
    tickets.address,
    operatorStore.address,
    modStore.address,
    prices.address,
    "0x0000000000000000000000000000000000000000",
    governance.address,
  ]);

  const ballot = await deploy("FundingCycleBallot", [juicer.address]);

  await deploy("DirectPayments", [projects.address, operatorStore.address]);

  const blockGasLimit = 9000000;

  try {
    const ProjectsFactory = await ethers.getContractFactory("Projects");
    const FundingCyclesFactory = await ethers.getContractFactory(
      "FundingCycles"
    );
    const TicketsFactory = await ethers.getContractFactory("Tickets");
    const PricesFactory = await ethers.getContractFactory("Prices");
    const GovernanceFactory = await ethers.getContractFactory("Governance");
    const JuicerFactory = await ethers.getContractFactory("Juicer");

    const attachedProjects = await ProjectsFactory.attach(projects.address);
    const attachedFundingCycles = await FundingCyclesFactory.attach(
      fundingCycles.address
    );
    const attachedTickets = await TicketsFactory.attach(tickets.address);
    const attachedPrices = await PricesFactory.attach(prices.address);
    const attachedGovernance = await GovernanceFactory.attach(
      governance.address
    );
    const attachedJuicer = await JuicerFactory.attach(juicer.address);

    console.log("⚡️ Setting the projects owner");
    await attachedProjects.setOwnership(governance.address, {
      gasLimit: blockGasLimit,
    });
    console.log("⚡️ Setting the fundingCycles owner");
    await attachedFundingCycles.setOwnership(governance.address, {
      gasLimit: blockGasLimit,
    });
    console.log("⚡️ Setting the tickets owner");
    await attachedTickets.setOwnership(governance.address, {
      gasLimit: blockGasLimit,
    });
    console.log("⚡️ Setting the prices owner");
    await attachedPrices.transferOwnership(governance.address, {
      gasLimit: blockGasLimit,
    });

    console.log("⚡️ Granting the juicer admin privileges over the projects");
    await attachedGovernance.grantAdmin(projects.address, juicer.address, {
      gasLimit: blockGasLimit,
    });
    console.log(
      "⚡️ Granting the juicer admin privileges over the funding cycles"
    );
    await attachedGovernance.grantAdmin(fundingCycles.address, juicer.address, {
      gasLimit: blockGasLimit,
    });
    console.log("⚡️ Granting the juicer admin privileges over the tickets");
    await attachedGovernance.grantAdmin(tickets.address, juicer.address, {
      gasLimit: blockGasLimit,
    });

    if (ethUsdAddr) {
      console.log("⚡️ Adding ETH/USD price feed to the funding cycles");
      await attachedGovernance.addPriceFeed(
        fundingCycles.address,
        ethUsdAddr,
        1,
        {
          gasLimit: blockGasLimit,
        }
      );
    }

    console.log("⚡️ Setting governance's Juice terminal");
    await attachedGovernance.setJuiceTerminal(juicer.address, {
      gasLimit: blockGasLimit,
    });

    // TODO set the owner of the admin contract.
    // await attachedJuicer.transferOwnership(admin.address, {
    //   gasLimit: blockGasLimit
    // });

    console.log("⚡️ Set the deployer as an operator of governance");
    await attachedGovernance.addOperators(
      operatorStore.address,
      [0],
      [governance.signer.address],
      [[2]],
      {
        gasLimit: blockGasLimit,
      }
    );

    console.log("⚡️ Configuring governance's budget");

    const duration = 2592000; // 30 days;
    const discountRate = 970;

    await attachedJuicer.deploy(
      governance.address,
      "Juice",
      "juice",
      "https://medmunch.com/wp-content/uploads/2020/04/Mango-Juice.jpg",
      "https://juice.work",
      "0x8AC7230489E80000", // 3635C9ADC5DEA00000",
      1,
      duration,
      discountRate,
      {
        bondingCurveRate: 690,
        reservedRate: 50,
        reconfigurationBondingCurveRate: 1000,
      },
      ballot.address,
      {
        gasLimit: blockGasLimit,
      }
    );

    console.log("⚡️ Remove the deployer as an operator of governance");
    await attachedGovernance.removeOperators(
      operatorStore.address,
      governance.address,
      [0],
      [governance.signer.address],
      {
        gasLimit: blockGasLimit,
      }
    );
  } catch (e) {
    console.log("Failed to set up environment: ", e);
  }

  console.log(
    " 💾  Artifacts (address, abi, and args) saved to: ",
    chalk.blue("packages/hardhat/artifacts/"),
    "\n\n"
  );

  return {
    governance,
    prices,
    projects,
    fundingCycles,
    tickets,
    juicer,
  };
};

const deploy = async (contractName, _args) => {
  console.log(` 🛰  Deploying: ${contractName}`);

  const contractArgs = _args || [];
  const contractArtifacts = await ethers.getContractFactory(contractName);
  const deployed = await contractArtifacts.deploy(...contractArgs);
  await deployed.deployTransaction.wait();

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
const isSolidity = (fileName) =>
  fileName.indexOf(".sol") >= 0 && fileName.indexOf(".swp") < 0;

const readArgsFile = (contractName) => {
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
