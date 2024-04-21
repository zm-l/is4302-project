const hre = require("hardhat");

async function main() {
  const ASTRAEA = await hre.ethers.getContractFactory("ASTRAEA");
  const astraea = await ASTRAEA.deploy(1000000);

  await astraea.deployed();

  console.log("ASTRAEA deployed to:", astraea.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
