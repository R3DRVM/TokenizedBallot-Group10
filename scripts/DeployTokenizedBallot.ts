import { ethers } from "ethers";
import { TokenizedBallot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function main() {
  const proposals = ["Green", "Blue", "Red"];
  //get token contract address
  //   const tokenContract = process.argv[2];
  const tokenContract = "0xa2Ad5c57aFD0C95805DD0726eFDC8d492A5adbf3";
  console.log(`Token Contract Address: ${tokenContract}`);
  //set provider, network and wallet
  const provider = ethers.getDefaultProvider(
    "goerli",
    process.env.ALCHEMY_API_KEY ?? ""
  );
  const network = await provider.getNetwork();
  const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
  const signer = wallet.connect(provider);
  console.log(
    `Connected to wallet ${signer.address} to the provider ${network.name}`
  );

  //check balance
  const balance = await signer.getBalance();
  console.log(`This address has a balance of ${balance} wei`);
  if (balance.eq(0)) throw new Error("Insufficient balance");

  //get block number
  const lastBlock = await provider.getBlock("latest");
  console.log(`current block number is ${lastBlock.number}`);

  //deploy tokenized ballot contract
  proposals.forEach((element, index) => {
    console.log(`Proposal ${index}: ${element}`);
  });

  const ballotContractFactory = new TokenizedBallot__factory(signer);
  const ballotContract = await ballotContractFactory.deploy(
    convertStringArrayToBytes32(proposals),
    tokenContract,
    lastBlock.number - 1
  );
  await ballotContract.deployed();
  console.log(
    `Tokenized Ballot contract deployed at ${ballotContract.address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
