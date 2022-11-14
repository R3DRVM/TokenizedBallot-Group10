import { ethers } from "ethers";
import { MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  console.log("Deploying MyToken");

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

  //deploy
  const contractFactory = new MyToken__factory(signer);
  const contract = await contractFactory.deploy();
  await contract.deployed();
  console.log(`Token contract deployed at ${contract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
