/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { ethers } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");
const weth = require("../constants/weth");

module.exports = async (wethAddr, ethUsdAddr) => {
  const token = !wethAddr && (await deploy("Token"));
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

  const yielder = await deploy("YearnYielder", [
    weth(process.env.HARDHAT_NETWORK) || token.address,
  ]);

  const juicer = await deploy("Juicer", [
    projects.address,
    fundingCycles.address,
    tickets.address,
    operatorStore.address,
    modStore.address,
    prices.address,
    yielder.address,
  ]);

  const admin = await deploy("Admin", [juicer.address]);

  const ballot = await deploy("FundingCycleBallot", [juicer.address]);

  await deploy("DirectPayments", [projects.address, operatorStore.address]);

  const blockGasLimit = 9000000;

  try {
    const ProjectsFactory = await ethers.getContractFactory("Projects");
    const FundingCyclesFactory = await ethers.getContractFactory(
      "FundingCycles"
    );
    const PricesFactory = await ethers.getContractFactory("Prices");
    const YielderFactory = await ethers.getContractFactory("YearnYielder");
    const AdminFactory = await ethers.getContractFactory("Admin");
    const JuicerFactory = await ethers.getContractFactory("Juicer");

    const attachedProjects = await ProjectsFactory.attach(projects.address);
    const attachedFundingCycles = await FundingCyclesFactory.attach(
      fundingCycles.address
    );
    const attachedPrices = await PricesFactory.attach(prices.address);
    const attachedYielder = await YielderFactory.attach(yielder.address);
    const attachedAdmin = await AdminFactory.attach(admin.address);
    const attachedJuicer = await JuicerFactory.attach(juicer.address);

    console.log("⚡️ Setting the projects owner");
    await attachedProjects.setOwnership(admin.address, {
      gasLimit: blockGasLimit,
    });
    console.log("⚡️ Setting the fundingCycles owner");
    await attachedFundingCycles.setOwnership(admin.address, {
      gasLimit: blockGasLimit,
    });
    console.log("⚡️ Setting the prices owner");
    await attachedPrices.transferOwnership(admin.address, {
      gasLimit: blockGasLimit,
    });
    console.log("⚡️ Setting the yielder owner");
    await attachedYielder.transferOwnership(juicer.address, {
      gasLimit: blockGasLimit,
    });

    console.log("⚡️ Granting the juicer admin privileges over the projects");
    await attachedAdmin.grantAdmin(projects.address, juicer.address, {
      gasLimit: blockGasLimit,
    });
    console.log(
      "⚡️ Granting the juicer admin privileges over the funding cycles"
    );
    await attachedAdmin.grantAdmin(fundingCycles.address, juicer.address, {
      gasLimit: blockGasLimit,
    });

    if (ethUsdAddr) {
      console.log("⚡️ Adding ETH/USD price feed to the funding cycles");
      await attachedAdmin.addPriceFeed(fundingCycles.address, ethUsdAddr, 1, {
        gasLimit: blockGasLimit,
      });
    }

    console.log("⚡️ Setting the admin of the juicer");
    await attachedJuicer.setAdmin(admin.address, {
      gasLimit: blockGasLimit,
    });

    // TODO set the owner of the admin contract.
    // await attachedJuicer.transferOwnership(admin.address, {
    //   gasLimit: blockGasLimit
    // });

    console.log("⚡️ Set the deployer as an operator of the admin");
    await attachedAdmin.addOperator(
      operatorStore.address,
      admin.signer.address,
      3,
      {
        gasLimit: blockGasLimit,
      }
    );

    console.log("⚡️ Configuring the admins budget");

    const duration = 2592000; // 30 days;
    const discountRate = 970;

    await attachedJuicer.deploy(
      admin.address,
      "Juice",
      "juice",
      "https://medmunch.com/wp-content/uploads/2020/04/Mango-Juice.jpg",
      "https://juice.work",
      "0x3635C9ADC5DEA00000",
      1,
      duration,
      discountRate,
      {
        bondingCurveRate: 690,
        reservedRate: 50,
      },
      ballot.address,
      {
        gasLimit: blockGasLimit,
      }
    );

    console.log("⚡️ Remove the deployer as an operator of the admin");
    await attachedAdmin.removeOperator(
      operatorStore.address,
      admin.address,
      admin.signer.address,
      {
        gasLimit: blockGasLimit,
      }
    );

    console.log("⚡️ Setting the admin's project ID");
    // Create the admin's budget.
    await attachedAdmin.setProjectId(1);
  } catch (e) {
    console.log("Failed to set up environment: ", e);
  }

  console.log(
    " 💾  Artifacts (address, abi, and args) saved to: ",
    chalk.blue("packages/hardhat/artifacts/"),
    "\n\n"
  );

  return {
    admin,
    token,
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
