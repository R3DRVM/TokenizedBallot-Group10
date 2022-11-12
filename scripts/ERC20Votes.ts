import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config()

const MINT_VALUE = ethers.utils.parseEther("10");

async function main ()  {
    const accounts = await ethers.getSigners();
    // Deploy Contract
    console.log("Deploying Tokenized Ballot");
    const provider = ethers.getDefaultProvider("goerli", {alchemy: process.env.ALCHEMY_API_KEY});
    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
    const signer = wallet.connect(provider);
    console.log(`Connected to the wallet ${signer.address}`);
    const balance = await signer.getBalance();
    console.log(`This address has a balance of ${balance} wei`);
    if (balance.eq(0)) throw new Error("Insufficient funds");
    const contractFactory = new MyToken__factory(accounts[0]);
    const contract = await contractFactory.deploy();
    await contract.deployed();
    console.log(`Token contract deployed at ${contract.address}\n`);
    //Mint some tokens
    const mintTx = await contract.mint(accounts[1].address, MINT_VALUE);
    await mintTx.wait();
    console.log(
        `Minted ${MINT_VALUE.toString()} decimal units to account ${
       accounts[1].address 
    }\n`)
    const balanceBN = await contract.balanceOf(accounts[1].address);
    console.log(
        `Account ${
            accounts[1].address
        } has ${balanceBN.toString()} decimal units of MyToken\n`
    );
    //Self delegate
    const delegateTx = await contract
        .connect(accounts[1])
        .delegate(accounts[1].address);
    await delegateTx.wait();
    // check voting power
    const votesAfter = await contract.getVotes(accounts[1].address);
    console.log(
        `Account ${
            accounts[1].address
        } has ${votesAfter.toString()} units of voting power after self delegating\n`
    );
    //Transfer tokens
    const transferTx = await contract
        .connect(accounts[1])
        .transfer(accounts[2].address, MINT_VALUE.div(2));
    await transferTx.wait();
    //Check voting power
    const votesAfterTransfer1 = await contract.getVotes(accounts[1].address)
    console.log(
        `Account ${
            accounts[1].address
        } has ${votesAfterTransfer1.toString()} units of voting power after self delegating`
    );
    const votesAfterTransfer2 = await contract.getVotes(accounts[2].address)
    console.log(
        `Account ${
            accounts[2].address
        } has ${votesAfterTransfer2.toString()} units of voting power after self delegating`
    );
    // Check past voting power
    const lastBlock = await ethers.provider.getBlock("latest");
    console.log(`Current block number is ${lastBlock.number}\n`);
    const pastVotes = await contract.getPastVotes(
        accounts[1].address, 
        lastBlock.number -1
        );
    console.log(
        `Account ${
            accounts[1].address
        } has ${pastVotes.toString()} units of voting power at previous block`
    )
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
