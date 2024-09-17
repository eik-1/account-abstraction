const hre = require("hardhat");

const FACTORY_NONCE = 1;
const FACTORY_ADDRESS = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
const EP_ADDRESS = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
const PAYMASTER_ADDRESS = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";

async function main() {
  const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);

  //CREATE : hash(sender + nonce)   [WE ARE USING THIS]
  //CREATE2: hash(0xFF + sender + bytecode + salt)

  const sender = await hre.ethers.getCreateAddress({
    from: FACTORY_ADDRESS,
    nonce: FACTORY_NONCE,
  });

  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
  const [signer0] = await hre.ethers.getSigners();
  const address0 = await signer0.getAddress(); //Owner of the smart contract
  const initCode = "0x";
  // FACTORY_ADDRESS +
  // AccountFactory.interface
  //   .encodeFunctionData("createAccount", [address0])
  //   .slice(2);

  console.log({ sender });

  //Prefund the gas to Paymaster
  // await entryPoint.depositTo(PAYMASTER_ADDRESS, {
  //   value: hre.ethers.parseEther("10"),
  // });

  const Account = await hre.ethers.getContractFactory("Account");

  const userOp = {
    sender, // Smart account address
    nonce: await entryPoint.getNonce(sender, 0),
    initCode,
    callData: Account.interface.encodeFunctionData("execute", []),
    callGasLimit: 200_000,
    verificationGasLimit: 200_000,
    preVerificationGas: 50_000,
    maxFeePerGas: hre.ethers.parseUnits("10", "gwei"),
    maxPriorityFeePerGas: hre.ethers.parseUnits("5", "gwei"),
    paymasterAndData: PAYMASTER_ADDRESS,
    signature: signer0.signMessage(hre.ethers.getBytes(hre.ethers.id("wee"))),
  };

  const tx = await entryPoint.handleOps([userOp], address0);
  const receipt = await tx.wait();
  console.log("Transaction receipt:", receipt);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
