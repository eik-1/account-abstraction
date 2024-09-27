const hre = require("hardhat");

const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const PAYMASTER_ADDRESS = "0xF786355Aa65bCD3fc2179aD068dA1c2BC80cFD8b";

async function main() {
  const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);

  // Prefund the gas to Paymaster
  await entryPoint.depositTo(PAYMASTER_ADDRESS, {
    value: hre.ethers.parseEther(".005"),
  });

  console.log("Deposit was successful");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
