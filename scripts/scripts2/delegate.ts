import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { MyToken__factory } from "../typechain-types";
dotenv.config()
//MyToken Address
const contractAddress = "0x7bFF174e20dBe67936cE74Ea56595b2D57aeB472";
async function main() {
    const provider = ethers.getDefaultProvider("goerli", { alchemy: process.env.ALCHEMY_API });
    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
    const signer = wallet.connect(provider);
    const tokenContractFactory = new MyToken__factory(signer);
    const tokenContract = tokenContractFactory.attach(contractAddress);
    const votePower = await tokenContract.getVotes(signer.address);
    console.log(`Your voting power is: ${votePower}`);
    if (votePower.eq(0)) {
        return
        console.log("no voting power");  
    }
    console.log("Delegating votes");
    const mintTx = await tokenContract.delegate(signer.address);
    await mintTx.wait();

    const newVotePower = await tokenContract.getVotes(signer.address);
    console.log(`Your voting power: ${newVotePower}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})
