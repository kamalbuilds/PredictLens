import { HardhatRuntimeEnvironment } from "hardhat/types";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * Script to verify all deployed contracts
 * @param hre HardhatRuntimeEnvironment
 */
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log("Starting contract verification...");
  
  // Get the addresses of the deployed contracts
  // These should be provided as environment variables after deployment
  const mockActionHubAddress = process.env.MOCK_ACTION_HUB_ADDRESS;
  const mockERC20Address = process.env.MOCK_ERC20_ADDRESS;
  const predictionMarketAddress = process.env.PREDICTION_MARKET_ADDRESS;
  const quadraticVotingAddress = process.env.QUADRATIC_VOTING_ADDRESS;
  const predictLensSmartMediaAddress = process.env.PREDICT_LENS_SMART_MEDIA_ADDRESS;
  
  // Verify each contract with its constructor arguments
  
  // Verify MockActionHub
  if (mockActionHubAddress) {
    console.log(`Verifying MockActionHub at ${mockActionHubAddress}...`);
    try {
      await hre.run("verify", {
        address: mockActionHubAddress,
        constructorArgs: [],
        contract: "contracts/mocks/MockActionHub.sol:MockActionHub"
      });
      console.log("MockActionHub verified successfully");
    } catch (error) {
      console.error("Failed to verify MockActionHub:", error);
    }
  }
  
  // Verify MockERC20
  if (mockERC20Address) {
    console.log(`Verifying MockERC20 at ${mockERC20Address}...`);
    try {
      await hre.run("verify", {
        address: mockERC20Address,
        constructorArgs: ["Lens Prediction Token", "LPT"],
        contract: "contracts/mocks/MockERC20.sol:MockERC20"
      });
      console.log("MockERC20 verified successfully");
    } catch (error) {
      console.error("Failed to verify MockERC20:", error);
    }
  }
  
  // Verify PredictionMarket
  if (predictionMarketAddress && mockActionHubAddress && mockERC20Address) {
    console.log(`Verifying PredictionMarket at ${predictionMarketAddress}...`);
    try {
      await hre.run("verify", {
        address: predictionMarketAddress,
        constructorArgs: [mockActionHubAddress, mockERC20Address],
        contract: "contracts/contracts/PredictionMarket.sol:PredictionMarket"
      });
      console.log("PredictionMarket verified successfully");
    } catch (error) {
      console.error("Failed to verify PredictionMarket:", error);
    }
  }
  
  // Verify QuadraticVoting
  if (quadraticVotingAddress && mockActionHubAddress) {
    console.log(`Verifying QuadraticVoting at ${quadraticVotingAddress}...`);
    try {
      await hre.run("verify", {
        address: quadraticVotingAddress,
        constructorArgs: [mockActionHubAddress],
        contract: "contracts/contracts/QuadraticVoting.sol:QuadraticVoting"
      });
      console.log("QuadraticVoting verified successfully");
    } catch (error) {
      console.error("Failed to verify QuadraticVoting:", error);
    }
  }
  
  // Verify PredictLensSmartMedia
  if (predictLensSmartMediaAddress && mockActionHubAddress) {
    console.log(`Verifying PredictLensSmartMedia at ${predictLensSmartMediaAddress}...`);
    try {
      await hre.run("verify", {
        address: predictLensSmartMediaAddress,
        constructorArgs: [mockActionHubAddress],
        contract: "contracts/contracts/PredictLensSmartMedia.sol:PredictLensSmartMedia"
      });
      console.log("PredictLensSmartMedia verified successfully");
    } catch (error) {
      console.error("Failed to verify PredictLensSmartMedia:", error);
    }
  }
  
  console.log("Contract verification completed");
} 