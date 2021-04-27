/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { l2ethers, ethers } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");
const weth = require("../constants/weth");
const ethUsdPriceFeed = require("../constants/eth_usd_price_feed");

const main = async () => {
  const token =
    process.env.HARDHAT_NETWORK === "localhost" && (await deploy("Token"));
  const prices = await deploy("Prices");
  const projects = await deploy("Projects");
  const fundingCycles = await deploy("FundingCycles");
  const tickets = await deploy("Tickets");

  const juicer = await deploy("Juicer", [
    projects.address,
    fundingCycles.address,
    tickets.address,
    prices.address,
  ]);

  const admin = await deploy("Admin", [
    juicer.address,
    // TODO Set the PM as an address controlled by the team.
    "0x766621e1e1274496ab3d65badc5866024f1ab7b8",
  ]);

  const blockGasLimit = 9000000;

  try {
    const ProjectsFactory = await ethers.getContractFactory("Projects");
    const TicketsFactory = await ethers.getContractFactory("Tickets");
    const FundingCyclesFactory = await ethers.getContractFactory(
      "FundingCycles"
    );
    const PricesFactory = await ethers.getContractFactory("Prices");
    const AdminFactory = await ethers.getContractFactory("Admin");
    // const StakerFactory = await ethers.getContractFactory("TimelockStaker");
    const JuicerFactory = await ethers.getContractFactory("Juicer");

    const attachedProjects = await ProjectsFactory.attach(projects.address);
    const attachedTickets = await TicketsFactory.attach(tickets.address);
    const attachedFundingCycles = await FundingCyclesFactory.attach(
      fundingCycles.address
    );
    const attachedPrices = await PricesFactory.attach(prices.address);
    const attachedAdmin = await AdminFactory.attach(admin.address);
    // const attachedStaker = await StakerFactory.attach(staker.address);
    const attachedJuicer = await JuicerFactory.attach(juicer.address);

    console.log("⚡️ Setting the projects owner");
    await attachedProjects.setOwnership(admin.address, {
      gasLimit: blockGasLimit,
    });
    console.log("⚡️ Setting the tickets owner");
    await attachedTickets.setOwnership(admin.address, {
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
    console.log("⚡️ Granting the juicer admin privileges over the tickets");
    await attachedAdmin.grantAdmin(tickets.address, juicer.address, {
      gasLimit: blockGasLimit,
    });
    if (process.env.HARDHAT_NETWORK !== "localhost") {
      console.log("⚡️ Adding ETH/USD price feed to the funding cycles");
      await attachedAdmin.addPriceFeed(
        fundingCycles.address,
        ethUsdPriceFeed(process.env.HARDHAT_NETWORK),
        1,
        {
          gasLimit: blockGasLimit,
        }
      );
    }

    console.log("⚡️ Setting the admin of the juicer");
    await attachedJuicer.setAdmin(admin.address, {
      gasLimit: blockGasLimit,
    });

    // TODO set the owner of the admin contract.
    // await attachedJuicer.transferOwnership(admin.address, {
    //   gasLimit: blockGasLimit
    // });

    console.log("⚡️ Configuring the admins budget");
    // Create the admin's budget.
    await attachedJuicer.deploy(
      admin.address,
      "Juice",
      "juice",
      "https://medmunch.com/wp-content/uploads/2020/04/Mango-Juice.jpg",
      "https://juice.work",
      "0x3635C9ADC5DEA00000",
      1,
      2592000,
      970,
      690,
      50,
      {
        gasLimit: blockGasLimit,
      }
    );

    console.log("⚡️ Setting the admin's project ID");
    // Create the admin's budget.
    await attachedAdmin.setProjectId(1);
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

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
