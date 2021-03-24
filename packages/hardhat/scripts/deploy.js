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
  const budgetStore = await deploy("BudgetStore", [prices.address]);
  const ticketStore = await deploy("TicketStore");

  const juicer = await deploy("Juicer", [
    projects.address,
    budgetStore.address,
    ticketStore.address,
    weth(process.env.HARDHAT_NETWORK) || token.address,
  ]);

  // const staker = await deploy("TimelockStaker");
  // const budgetBallot = await deploy("BudgetBallot", [
  //   juicer.address,
  //   staker.address,
  // ]);

  const admin = await deploy("Admin", [
    juicer.address,
    "0x766621e1e1274496ab3d65badc5866024f1ab7b8",
  ]);

  const blockGasLimit = 9000000;

  try {
    const ProjectsFactory = await ethers.getContractFactory("Projects");
    const TicketStoreFactory = await ethers.getContractFactory("TicketStore");
    const BudgetStoreFactory = await ethers.getContractFactory("BudgetStore");
    const PricesFactory = await ethers.getContractFactory("Prices");
    const AdminFactory = await ethers.getContractFactory("Admin");
    // const StakerFactory = await ethers.getContractFactory("TimelockStaker");
    const JuicerFactory = await ethers.getContractFactory("Juicer");

    const attachedProjects = await ProjectsFactory.attach(projects.address);
    const attachedTicketStore = await TicketStoreFactory.attach(
      ticketStore.address
    );
    const attachedBudgetStore = await BudgetStoreFactory.attach(
      budgetStore.address
    );
    const attachedPrices = await PricesFactory.attach(prices.address);
    const attachedAdmin = await AdminFactory.attach(admin.address);
    // const attachedStaker = await StakerFactory.attach(staker.address);
    const attachedJuicer = await JuicerFactory.attach(juicer.address);

    console.log("⚡️ Setting the projects owner");
    await attachedProjects.setOwnership(admin.address, {
      gasLimit: blockGasLimit,
    });
    console.log("⚡️ Setting the ticket store owner");
    await attachedTicketStore.setOwnership(admin.address, {
      gasLimit: blockGasLimit,
    });
    console.log("⚡️ Setting the budget store owner");
    await attachedBudgetStore.setOwnership(admin.address, {
      gasLimit: blockGasLimit,
    });
    console.log("⚡️ Setting the prices owner");
    await attachedPrices.transferOwnership(admin.address, {
      gasLimit: blockGasLimit,
    });
    // console.log("⚡️ Setting the staker owner");
    // await attachedStaker.setOwnership(admin.address, {
    //   gasLimit: blockGasLimit,
    // });
    console.log("⚡️ Granting the juicer admin privileges over the projects");
    await attachedAdmin.grantAdmin(projects.address, juicer.address, {
      gasLimit: blockGasLimit,
    });
    console.log(
      "⚡️ Granting the juicer admin privileges over the budget store"
    );
    await attachedAdmin.grantAdmin(budgetStore.address, juicer.address, {
      gasLimit: blockGasLimit,
    });
    console.log(
      "⚡️ Granting the juicer admin privileges over the ticket store"
    );
    await attachedAdmin.grantAdmin(ticketStore.address, juicer.address, {
      gasLimit: blockGasLimit,
    });
    if (process.env.HARDHAT_NETWORK !== "localhost") {
      console.log("⚡️ Adding ETH/USD price feed to the budget store");
      await attachedAdmin.addPriceFeed(
        budgetStore.address,
        ethUsdPriceFeed(process.env.HARDHAT_NETWORK),
        1,
        {
          gasLimit: blockGasLimit,
        }
      );
    }

    // console.log("⚡️ Set the budget store's current ballot");
    // await attachedAdmin.setBudgetBallot(
    //   budgetStore.address,
    //   budgetBallot.address,
    //   {
    //     gasLimit: blockGasLimit,
    //   }
    // );

    console.log("⚡️ Setting the admin of the juicer");
    await attachedJuicer.setAdmin(admin.address, {
      gasLimit: blockGasLimit,
    });

    // TODO set the owner of the admin contract.
    // await attachedJuicer.transferOwnership(admin.address, {
    //   gasLimit: blockGasLimit
    // });

    // console.log("⚡️ Setting the budget ballot as a controller of the staker");
    // // Make this Ballot a timelock controller of the staker contract.
    // await attachedAdmin.setControllerStatus(
    //   staker.address,
    //   budgetBallot.address,
    //   true,
    //   {
    //     gasLimit: blockGasLimit,
    //   }
    // );

    console.log("⚡️ Configuring the admins budget");
    // Create the admin's budget.
    await attachedJuicer.deploy(
      admin.address,
      "Juice",
      "0x3635C9ADC5DEA00000",
      1,
      2592000,
      "https://asdf.com",
      970,
      382,
      50,
      {
        gasLimit: blockGasLimit,
      }
    );
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
