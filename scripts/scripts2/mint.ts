import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { MyToken__factory } from "../typechain-types";
dotenv.config()
//MyToken Address
const contractAddress = "0x350e655770e02e05B4f22169A7b8d3d5aAd6B46a";
const MINT_VALUE = ethers.utils.parseEther("10");

async function main() {
    const provider = ethers.getDefaultProvider("goerli", { alchemy: process.env.ALCHEMY_API });
    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
    const signer = wallet.connect(provider);


    const tokenContractFactory = new MyToken__factory(signer);
    const tokenContract = tokenContractFactory.attach(contractAddress);

    const signerBalance = await tokenContract.balanceOf(signer.address);

    console.log(`Your balance is: ${signerBalance}`);

    console.log("Minting tokens");
    const mintTx = await tokenContract.mint(signer.address, MINT_VALUE);
    await mintTx.wait();

    const newBalance = await tokenContract.balanceOf(signer.address);
    console.log(`Your new balance is: ${newBalance}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})
