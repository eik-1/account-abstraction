const hre = require("hardhat");

// const FACTORY_NONCE = 1;
const FACTORY_ADDRESS = "0x7a9Bb0730f66D78C84c281CB8b6BF39D50A35D27";
const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const PAYMASTER_ADDRESS = "0xF786355Aa65bCD3fc2179aD068dA1c2BC80cFD8b";

async function main() {
  const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);

  //CREATE : hash(sender + nonce)   [WE ARE USING THIS]
  // const sender = await hre.ethers.getCreateAddress({
  //   from: FACTORY_ADDRESS,
  //   nonce: FACTORY_NONCE,
  // });

  //CREATE2: hash(0xFF + sender + bytecode + salt)

  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
  const [signer0] = await hre.ethers.getSigners();
  const address0 = await signer0.getAddress(); //Owner of the smart contract
  let initCode =
    FACTORY_ADDRESS +
    AccountFactory.interface
      .encodeFunctionData("createAccount", [address0])
      .slice(2);
  let sender;

  //Getting the sender address
  try {
    await entryPoint.getSenderAddress(initCode); //This will always revert so we need to put it in
    // a try catch block and extract the sender address from the error message
  } catch (ex) {
    sender = "0x" + ex.data.slice(-40);
  }
  console.log({ sender }); //Addresss of the new smart account

  const code = await hre.ethers.provider.getCode(sender);
  if (code !== "0x") {
    initCode = "0x";
  }

  const Account = await hre.ethers.getContractFactory("Account");

  const userOp = {
    sender, // Smart account address
    nonce: "0x" + (await entryPoint.getNonce(sender, 0)).toString(16),
    initCode,
    callData: Account.interface.encodeFunctionData("execute", []),
    paymasterAndData: PAYMASTER_ADDRESS,
    signature:
      "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c",
  };

  const { preVerificationGas, callGasLimit, verificationGasLimit } =
    await hre.ethers.provider.send("eth_estimateUserOperationGas", [
      userOp,
      EP_ADDRESS,
    ]);

  userOp.preVerificationGas = preVerificationGas;
  userOp.callGasLimit = callGasLimit;
  userOp.verificationGasLimit = verificationGasLimit;

  const { maxFeePerGas } = await hre.ethers.provider.getFeeData();

  userOp.maxFeePerGas = "0x" + maxFeePerGas.toString(16);

  userOp.maxPriorityFeePerGas = await hre.ethers.provider.send(
    "rundler_maxPriorityFeePerGas",
    []
  );

  const userOpHash = await entryPoint.getUserOpHash(userOp);
  userOp.signature = await signer0.signMessage(hre.ethers.getBytes(userOpHash));

  const opHash = await ethers.provider.send("eth_sendUserOperation", [
    userOp,
    EP_ADDRESS,
  ]);

  setTimeout(async () => {
    const { transactionHash } = await ethers.provider.send(
      "eth_getUserOperationByHash",
      [opHash]
    );

    console.log(transactionHash);
  }, 5000);

  // const tx = await entryPoint.handleOps([userOp], address0);
  // const receipt = await tx.wait();
  // console.log("Transaction receipt:", receipt);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
