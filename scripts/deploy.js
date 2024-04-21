const hre = require("hardhat");

async function main() {
  const ASTREA = await hre.ethers.getContractFactory("ASTREA");
  const astrea = await ASTREA.deploy(1000000);

  await astrea.deployed();

  console.log("ASTREA deployed to:", astrea.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
