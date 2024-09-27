const hre = require("hardhat");

const ACCOUNT_ADDRESS = "0x5b9e2c7450b9bb561a8243af4c61029a28ebe71b";

async function main() {
  const account = await hre.ethers.getContractAt("Account", ACCOUNT_ADDRESS);
  const count = await account.count();
  console.log("Count:", count);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
