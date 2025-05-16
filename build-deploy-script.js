const fs = require('fs');
const path = require('path');

// Ensure the deploy directory exists
const deployDir = path.join(__dirname, 'deploy');
if (!fs.existsSync(deployDir)) {
  fs.mkdirSync(deployDir, { recursive: true });
}

// The content of the deployment script
const deployScriptContent = `import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Wallet } from "zksync-ethers";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * Main deployment script for all contracts
 * @param hre HardhatRuntimeEnvironment
 */
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(\`Running deployment script for Lens Protocol contracts\`);
  
  // Initialize the wallet
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("PRIVATE_KEY is not set in environment variables");
  }
  
  const wallet = new Wallet(privateKey);
  console.log(\`Deploying with address: \${wallet.address}\`);
  
  // Create deployer object
  const deployer = new Deployer(hre, wallet);
  
  // We need to create or identify an Action Hub contract
  // For this example, we'll create a mock ActionHub to use
  console.log(\`Creating mock ActionHub for testing...\`);
  const mockActionHubArtifact = await deployer.loadArtifact("MockActionHub");
  const mockActionHubContract = await deployer.deploy(mockActionHubArtifact, []);
  const actionHubAddress = await mockActionHubContract.getAddress();
  console.log(\`MockActionHub was deployed to \${actionHubAddress}\`);
  
  // For PredictionMarket we also need a staking token address
  // For this example, we'll create a mock ERC20 token to use
  console.log(\`Creating mock ERC20 token for staking...\`);
  const mockTokenArtifact = await deployer.loadArtifact("MockERC20");
  const mockTokenContract = await deployer.deploy(mockTokenArtifact, ["Lens Prediction Token", "LPT"]);
  const stakingTokenAddress = await mockTokenContract.getAddress();
  console.log(\`MockERC20 was deployed to \${stakingTokenAddress}\`);
  
  // Now deploy the main contracts
  
  // Deploy PredictionMarket
  console.log(\`Deploying PredictionMarket...\`);
  const predictionMarketArtifact = await deployer.loadArtifact("PredictionMarket");
  const predictionMarketContract = await deployer.deploy(predictionMarketArtifact, [
    actionHubAddress,
    stakingTokenAddress
  ]);
  const predictionMarketAddress = await predictionMarketContract.getAddress();
  console.log(\`PredictionMarket was deployed to \${predictionMarketAddress}\`);
  
  // Deploy QuadraticVoting
  console.log(\`Deploying QuadraticVoting...\`);
  const quadraticVotingArtifact = await deployer.loadArtifact("QuadraticVoting");
  const quadraticVotingContract = await deployer.deploy(quadraticVotingArtifact, [
    actionHubAddress
  ]);
  const quadraticVotingAddress = await quadraticVotingContract.getAddress();
  console.log(\`QuadraticVoting was deployed to \${quadraticVotingAddress}\`);
  
  // Deploy PredictLensSmartMedia
  console.log(\`Deploying PredictLensSmartMedia...\`);
  const predictLensArtifact = await deployer.loadArtifact("PredictLensSmartMedia");
  const predictLensContract = await deployer.deploy(predictLensArtifact, [
    actionHubAddress
  ]);
  const predictLensAddress = await predictLensContract.getAddress();
  console.log(\`PredictLensSmartMedia was deployed to \${predictLensAddress}\`);
  
  // Log all deployed contract addresses
  console.log("\\nDeployment summary:");
  console.log(\`- MockActionHub: \${actionHubAddress}\`);
  console.log(\`- MockERC20 (Staking Token): \${stakingTokenAddress}\`);
  console.log(\`- PredictionMarket: \${predictionMarketAddress}\`);
  console.log(\`- QuadraticVoting: \${quadraticVotingAddress}\`);
  console.log(\`- PredictLensSmartMedia: \${predictLensAddress}\`);
  
  // Return deployed contract addresses for testing or further use
  return {
    mockActionHub: actionHubAddress,
    mockERC20: stakingTokenAddress,
    predictionMarket: predictionMarketAddress,
    quadraticVoting: quadraticVotingAddress,
    predictLensSmartMedia: predictLensAddress
  };
}`;

// Write the deployment script to the file
const filePath = path.join(deployDir, 'deploy-all-contracts.ts');
fs.writeFileSync(filePath, deployScriptContent);

console.log(`Deployment script created at: ${filePath}`); 