// Script to deploy the Lens Protocol contracts

const { Deployer } = require("@matterlabs/hardhat-zksync-deploy");
const { Wallet } = require("zksync-ethers");
require("dotenv").config();

// Main deployment function
async function main() {
  try {
    console.log(`Running deployment script for Lens Protocol contracts`);
    
    // Get hardhat runtime environment
    const hre = require("hardhat");
    console.log("Hardhat runtime environment loaded");
    
    // Initialize the wallet
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("PRIVATE_KEY is not set in environment variables");
    }
    console.log("Private key loaded");
    
    const wallet = new Wallet(privateKey);
    console.log(`Deploying with address: ${wallet.address}`);
    
    // Create deployer object
    const deployer = new Deployer(hre, wallet);
    console.log("Deployer created");
    
    // We need to create or identify an Action Hub contract
    // For this example, we'll create a mock ActionHub to use
    console.log(`Creating mock ActionHub for testing...`);
    try {
      const mockActionHubArtifact = await deployer.loadArtifact("MockActionHub");
      console.log("MockActionHub artifact loaded");
      const mockActionHubContract = await deployer.deploy(mockActionHubArtifact, []);
      console.log("MockActionHub deployment transaction submitted");
      const actionHubAddress = await mockActionHubContract.getAddress();
      console.log(`MockActionHub was deployed to ${actionHubAddress}`);
    
      // For PredictionMarket we also need a staking token address
      // For this example, we'll create a mock ERC20 token to use
      console.log(`Creating mock ERC20 token for staking...`);
      const mockTokenArtifact = await deployer.loadArtifact("MockERC20");
      console.log("MockERC20 artifact loaded");
      const mockTokenContract = await deployer.deploy(mockTokenArtifact, ["Lens Prediction Token", "LPT"]);
      console.log("MockERC20 deployment transaction submitted");
      const stakingTokenAddress = await mockTokenContract.getAddress();
      console.log(`MockERC20 was deployed to ${stakingTokenAddress}`);
    
      // Now deploy the main contracts
    
      // Deploy PredictionMarket
      console.log(`Deploying PredictionMarket...`);
      const predictionMarketArtifact = await deployer.loadArtifact("PredictionMarket");
      console.log("PredictionMarket artifact loaded");
      const predictionMarketContract = await deployer.deploy(predictionMarketArtifact, [
        actionHubAddress,
        stakingTokenAddress
      ]);
      console.log("PredictionMarket deployment transaction submitted");
      const predictionMarketAddress = await predictionMarketContract.getAddress();
      console.log(`PredictionMarket was deployed to ${predictionMarketAddress}`);
    
      // Deploy QuadraticVoting
      console.log(`Deploying QuadraticVoting...`);
      const quadraticVotingArtifact = await deployer.loadArtifact("QuadraticVoting");
      console.log("QuadraticVoting artifact loaded");
      const quadraticVotingContract = await deployer.deploy(quadraticVotingArtifact, [
        actionHubAddress
      ]);
      console.log("QuadraticVoting deployment transaction submitted");
      const quadraticVotingAddress = await quadraticVotingContract.getAddress();
      console.log(`QuadraticVoting was deployed to ${quadraticVotingAddress}`);
    
      // Deploy PredictLensSmartMedia
      console.log(`Deploying PredictLensSmartMedia...`);
      const predictLensArtifact = await deployer.loadArtifact("PredictLensSmartMedia");
      console.log("PredictLensSmartMedia artifact loaded");
      const predictLensContract = await deployer.deploy(predictLensArtifact, [
        actionHubAddress
      ]);
      console.log("PredictLensSmartMedia deployment transaction submitted");
      const predictLensAddress = await predictLensContract.getAddress();
      console.log(`PredictLensSmartMedia was deployed to ${predictLensAddress}`);
    
      // Log all deployed contract addresses
      console.log("\nDeployment summary:");
      console.log(`- MockActionHub: ${actionHubAddress}`);
      console.log(`- MockERC20 (Staking Token): ${stakingTokenAddress}`);
      console.log(`- PredictionMarket: ${predictionMarketAddress}`);
      console.log(`- QuadraticVoting: ${quadraticVotingAddress}`);
      console.log(`- PredictLensSmartMedia: ${predictLensAddress}`);
    } catch (error) {
      console.error("Error during deployment:", error);
    }
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

// Run the deployment
main()
  .then(() => {
    console.log("Deployment completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  }); 