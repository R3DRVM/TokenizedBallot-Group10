import { ethers } from "hardhat";
import { TokenizedBallot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config()


const proposals = ["Chocolate", "Vanilla", "Cookies", "Lemon"];
const tokenContractAddress = "0x350e655770e02e05B4f22169A7b8d3d5aAd6B46a";
const targetBlock = 7948569;

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
        bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
}

async function main() {
    console.log("Deploying TokenizedBallot");

    const provider = ethers.getDefaultProvider("goerli", { alchemy: process.env.ALCHEMY_API })
    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
    const signer = wallet.connect(provider);
    const ballotContractFactory = new TokenizedBallot__factory(signer);
    const ballotContract = await ballotContractFactory.deploy(
        convertStringArrayToBytes32(proposals),
        tokenContractAddress,
        targetBlock
    );
    await ballotContract.deployed();
    console.log(`TokenizedBallot contract was successfully deployed at ${ballotContract.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
