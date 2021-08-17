const chalk = require("chalk");

const juice = require("../scripts/utils");

/**
 * Deploys the TokenRepresentationProxy contract.
 *
 * Example usage:
 * npx hardhat deployTokenRepresentationProxy \
 *   --ticketbooth 0xee2eBCcB7CDb34a8A822b589F9E8427C24351bfc \
 *   --projectid 0x01 \
 *   --name "JBX Proxy" \
 *   --ticker JBXPROXY \
 *   --network rinkeby
 */
task(
  "deployTokenRepresentationProxy",
  "Deploys the TokenRepresentationProxy contract"
)
  .addParam("ticketbooth", "TicketBooth address")
  .addParam("projectid", "Project ID")
  .addParam("name", "ERC20 token name")
  .addParam("ticker", "ERC20 ticker symbol")
  .setAction(async (taskArgs) => {
    const contract = "TokenRepresentationProxy";
    console.log(
      `Deploying `,
      chalk.magenta(contract),
      `with the following params: `
    );
    console.log("TicketBooth: ", chalk.green(taskArgs.ticketbooth));
    console.log("ProjectId: ", chalk.green(taskArgs.projectid));
    console.log("erc20Name: ", chalk.green(taskArgs.name));
    console.log("erc20Ticker: ", chalk.green(taskArgs.ticker));
    await juice.deploy(contract, [
      taskArgs.ticketbooth,
      taskArgs.projectid,
      taskArgs.name,
      taskArgs.ticker,
    ]);
    console.log(`Successfully deployed `, chalk.magenta(contract));
  });
