import { ethers } from "ethers";
import { TokenizedBallot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();
async function main() {
  const contractAdress = process.argv[2]; // TokenizedBallot address
  const proposalIndex = 1;
  const voteAmount = 1;

  //set provider, network and wallet
  const provider = new ethers.providers.InfuraProvider("goerli", {
    infura: process.env.INFURA_API_KEY,
  });
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  const signer = wallet.connect(provider);
  console.log(`Connected to wallet ${signer.address}}`);

  //check balance
  const balance = await signer.getBalance();
  console.log(`This address has a balance of ${balance} wei`);
  if (balance.eq(0)) throw new Error("You're too poor!");

  //get existing TokenizedBallot contract address
  const ballotContractFactory = new TokenizedBallot__factory(signer);
  const ballotContract = await ballotContractFactory.attach(contractAdress);

  console.log("Checking voting power");
  const votingPower = await ballotContract.votingPower(signer.address);
  if (votingPower.eq(0)) {
    console.log("You have no voting power! Bye :)");
    return;
  } else {
    console.log(`You have ${votingPower} voting power!`);
  }

  //vote
  const voteTx = await ballotContract.vote(proposalIndex, voteAmount);
  await voteTx.wait();
  console.log(`You voted for #${proposalIndex}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
