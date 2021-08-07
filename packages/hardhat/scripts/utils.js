/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const chalk = require("chalk");
const { config, l2ethers, network, tenderly } = require("hardhat");
const { utils } = require("ethers");
const R = require("ramda");
const { JsonRpcProvider } = require("@ethersproject/providers");

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

exports.deploy = deploy;
exports.abiEncodeArgs = abiEncodeArgs;
exports.multisigAddress = "0xAF28bcB48C40dBC86f52D459A6562F658fc94B1e";
