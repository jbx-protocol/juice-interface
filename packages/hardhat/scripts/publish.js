const fs = require("fs");
const chalk = require("chalk");
const bre = require("hardhat");
const skipContracts = require("../constants/skip-publish");

const network = process.env.HARDHAT_NETWORK || "";
const publishDir = "../app/src/contracts/" + network;
const graphDir = "../subgraph";
const configFileName = network + ".json";
const graphConfigPath = `${graphDir}/config/${configFileName}`;

let graphConfig;

// If contract name is empty, all contracts will be published.
module.exports = (startBlock, singleContractName) =>
  publish(startBlock, singleContractName)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });

async function publish(startBlock, singleContractName) {
  console.log(
    "Publishing artifacts to app and hardhat directories for network:",
    chalk.bold(process.env.HARDHAT_NETWORK),
    "...",
    "\n"
  );

  try {
    if (fs.existsSync(graphConfigPath)) {
      graphConfig = fs.readFileSync(graphConfigPath).toString();
    } else {
      graphConfig = "{}";
    }
  } catch (e) {
    console.log(e);
  }

  console.log(
    "🗺  Creating subgraph config at",
    chalk.yellow(graphConfigPath),
    "\n"
  );

  graphConfig = JSON.parse(graphConfig);

  // local subgraph requires network name of 'mainnet'
  graphConfig.Network = network === "localhost" ? "mainnet" : network;
  graphConfig.AbisDir = network;
  graphConfig.StartBlock = parseInt(startBlock);

  if (!fs.existsSync(publishDir)) {
    fs.mkdirSync(publishDir);
  }
  const finalContractList = [];
  fs.readdirSync(bre.config.paths.sources).forEach((file) => {
    if (
      (singleContractName && file.indexOf(`${singleContractName}.sol`) >= 0) ||
      (!singleContractName && file.indexOf(`.sol`) >= 0)
    ) {
      const contractName = file.replace(".sol", "");
      // Add contract to list if publishing is successful
      if (publishContract(contractName)) finalContractList.push(contractName);
    }
  });
  fs.writeFileSync(
    `${publishDir}/contracts.js`,
    `module.exports = ${JSON.stringify(finalContractList)};`
  );

  console.log(chalk.green(" ✔ Published for network:"), network, "\n");
}

function publishContract(contractName) {
  if (skipContracts.includes(contractName)) {
    console.log("➖ Skipping contract:", chalk.cyan(contractName));
    return;
  }

  console.log(
    "⚡️ Saving",
    chalk.cyan(contractName),
    "artifacts to",
    chalk.yellow(publishDir)
  );

  try {
    let contract = fs
      .readFileSync(
        `${bre.config.paths.artifacts}/contracts/${contractName}.sol/${contractName}.json`
      )
      .toString();
    const address = fs
      .readFileSync(`${bre.config.paths.artifacts}/${contractName}.address`)
      .toString();
    contract = JSON.parse(contract);

    graphConfig[contractName + "Address"] = address;

    fs.writeFileSync(
      `${publishDir}/${contractName}.address.js`,
      `module.exports = "${address}";`
    );
    fs.writeFileSync(
      `${publishDir}/${contractName}.abi.js`,
      `module.exports = ${JSON.stringify(contract.abi, null, 2)};`
    );
    fs.writeFileSync(
      `${publishDir}/${contractName}.bytecode.js`,
      `module.exports = "${contract.bytecode}";`
    );

    const folderPath = graphConfigPath.replace(configFileName, "");
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
    fs.writeFileSync(graphConfigPath, JSON.stringify(graphConfig, null, 2));

    const configDir = `${graphDir}/abis/${network}`;
    const configFilePath = `${configDir}/${contractName}.json`;
    if (!fs.existsSync(configDir)) fs.mkdirSync(configDir);
    fs.writeFileSync(configFilePath, JSON.stringify(contract.abi, null, 2));

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
