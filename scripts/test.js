const hre = require("hardhat");

const ACCOUNT_ADDRESS = "0x61c36a8d610163660E21a8b7359e1Cac0C9133e1";

async function main() {
  const account = await hre.ethers.getContractAt("Account", ACCOUNT_ADDRESS);
  const count = await account.count();
  console.log("Count:", count);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
