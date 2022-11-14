import { BigNumberish, Bytes } from "ethers";
import { ethers } from "hardhat";
import { ERC20Votes__factory, MyToken__factory, TokenizedBallot__factory } from "../typechain-types";
import * as groupInfo from '../.groupInfo'
import { group } from "console";
import * as dotenv from 'dotenv' 
dotenv.config()


const MINT_VALUE = ethers.utils.parseEther("10")

async function main() {
    const provider = new ethers.providers.AlchemyProvider( "goerli", process.env.ALCHEMY_API_KEY)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    const signer = wallet.connect(provider);
    const voterWallet = new ethers.Wallet(process.env.PRIVATE_KEY2 ?? "");
    const voterSigner = voterWallet.connect(provider)
    const tokenContractFactory = new MyToken__factory(signer)
    const tokenContract = await tokenContractFactory.attach(groupInfo.tokenContractLesson12);
console.log(tokenContract.address)
    // mint the tokens
  const mintTx = await tokenContract.mint(groupInfo.voterMitch, MINT_VALUE) && await tokenContract.mint(groupInfo.redrumAddress, MINT_VALUE)
  await mintTx.wait();
  const tokenBalance = await tokenContract.balanceOf(groupInfo.voterMitch)
  console.log(`token contract deployed at ${tokenContract.address} and ${groupInfo.voterMitch} has ${tokenBalance}`)

     //check the voting power
 // self delegate
 const delegateTx = await tokenContract.connect(voterSigner).delegate(groupInfo.redrumAddress)
 await delegateTx.wait()
 const votes = await tokenContract.getVotes(groupInfo.voterMitch)
 const redrumVotes = await tokenContract.getVotes(groupInfo.redrumAddress)
 console.log(`${groupInfo.voterMitch} has ${votes.toString()} and ${groupInfo.redrumAddress} has ${redrumVotes.toString()}  \n`)
}

main().catch((error) =>{
    console.error(error);
    process.exitCode = 1;
})