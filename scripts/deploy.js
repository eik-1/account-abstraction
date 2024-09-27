const hre = require("hardhat");

async function main() {
  const af = await hre.ethers.deployContract("AccountFactory");
  await af.waitForDeployment();
  console.log("AccountFactory deployed to:", af.target);

  // const ep = await hre.ethers.deployContract("EntryPoint");
  // await ep.waitForDeployment();
  // console.log("EntryPoint deployed to:", ep.target);

  // const pm = await hre.ethers.deployContract("Paymaster");
  // await pm.waitForDeployment();
  // console.log("Paymaster deployed to:", pm.target);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
