/* eslint no-use-before-define: "warn" */
const { ethers } = require("hardhat");
const chalk = require("chalk");
const weth = require("../constants/weth");
const ethUsdPriceFeed = require("../constants/eth_usd_price_feed");
const deployer = require("./deployer");
const publish = require("./publish");

const network = process.env.HARDHAT_NETWORK;

const main = async () => {
  const wethAddr = weth(network);
  const ethUsdAddr = ethUsdPriceFeed(network);
  const startBlock = await ethers.provider.getBlockNumber();
  await deployer(wethAddr, ethUsdAddr);
  await publish(startBlock);
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
