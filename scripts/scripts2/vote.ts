import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { MyToken__factory, TokenizedBallot__factory } from "../typechain-types";
dotenv.config()
//MyToken Address
const tokenAddress = "0x350e655770e02e05B4f22169A7b8d3d5aAd6B46a"; 
//TokenizedBallot Address
const ballotAddress = "0xf185087be41f7ae83690998f97c8c512b3a55f00"; 
const proposalN = 0; //  proposal #
const votePower = 1; // voting power used 

async function main() {
    const provider = ethers.getDefaultProvider("goerli", { alchemy: process.env.ALCHEMY_API })
    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
    const signer = wallet.connect(provider);
    const tokenContractFactory = new MyToken__factory(signer);
    const tokenContract = tokenContractFactory.attach(tokenAddress)
    const ballotContractFactory = new TokenizedBallot__factory(signer);
    const ballotContract = ballotContractFactory.attach(ballotAddress);
    const votingPower = await ballotContract.votingPower(signer.address);
        console.log("Checking voting power");
    if (votingPower.eq(0)) {
         return       
        console.log("You do not have voting power");
    } 
    console.log(`Voting for proposal #${proposalN}`);

    const voteTx = await ballotContract.vote(proposalN, votePower);
    await voteTx.wait();
    console.log("Thanks for voting!");
    const proposalVoteCount = await (await ballotContract.proposals(proposalN)).voteCount;
    console.log(`Your proposal has ${proposalVoteCount} votes`);
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
