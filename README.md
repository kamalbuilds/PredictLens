# PredictLens 🔮

A decentralized prediction market platform built on Lens Protocol for the Lens Spring Hackathon 2025.

## What is PredictLens?

PredictLens is a SocialFi platform that combines the social features of Lens Protocol with prediction market mechanics and Bonsai Smart Media integrations. Users can create, join, and share prediction markets directly in the Lens social graph, enabling a new form of social interaction and monetization.

-> Key Features

- Social Prediction Markets: Create and participate in prediction markets directly in your Lens feed
- Smart Media Integrations: AI-powered market suggestions and dynamic updates using Bonsai Protocol
- Monetization for Creators: Market creators earn fees from participation
- On-chain Resolution: All markets are settled transparently on Lens Chain
- Quadratic Voting: Fair market resolution powered by quadratic voting mechanisms
- Customizable Feeds: Filter and sort markets based on personal interests

-> Technologies Used

- Lens Protocol: For social graph and interaction
- Bonsai Smart Media Protocol: For AI-powered dynamic content
- Next.js 15: Modern React framework for the frontend
- ConnectKit/Wagmi: Web3 wallet integration
- Lens Chain: For smart contract deployment
- Shadcn UI: Component library based on Radix primitives

## Getting Started

Welcome to the PredictLens template! Here's how to get started quickly:

1. Clone this repository
2. Install dependencies: `bun install`
3. Copy the environment file: `cp .env.example .env`
4. Create a Lens app at [https://developer.lens.xyz/apps](https://developer.lens.xyz/apps)
5. Copy your App ID and paste it into the `.env` file as `NEXT_PUBLIC_APP_ADDRESS`
6. Start the development server: `bun run dev`
7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/src/app`: Next.js app directory with pages and layouts
- `/src/components`: React components including UI elements
- `/src/hooks`: Custom React hooks
- `/src/lib`: Utility functions and API clients
- `/contracts`: Smart contracts for prediction markets

## Development Tools

- TS Toolkit: [Bun](https://bun.sh/)
- Linting & Formatting: [Biome](https://biomejs.dev/)
- Scripts:
  - `bun run dev` - Start development server
  - `bun run build` - Build for production
  - `bun run start` - Start production server
  - `bun run format` - Format code with Biome
  - `bun run lint` - Lint code with Biome
  - `bun run check` - Format and lint code with Biome

## Hackathon Submission

This project is a submission for the Lens Spring Hackathon 2025. For more information, visit [https://lens.xyz/news/lens-spring-hackathon](https://lens.xyz/news/lens-spring-hackathon).

# Lens Protocol Contracts

This project contains smart contracts designed to work with the Lens Protocol v3.

## Contracts

- **QuadraticVoting.sol**: A contract implementing quadratic voting for prediction market resolution
- **PredictionMarket.sol**: A prediction market contract that integrates with Lens Protocol v3
- **PredictLensSmartMedia.sol**: A contract for handling dynamic Smart Media content in prediction markets

## Setup

Make sure you have Node.js >= v20 installed. If you use nvm, you can run:

```bash
nvm use 20
```

Enable Corepack if it isn't already:

```bash
corepack enable
```

Install dependencies:

```bash
yarn install
```

## Deployment

The deployment process involves several steps:

1. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

2. Fill in your private key in the `.env` file:

```
PRIVATE_KEY=0x123...
```

3. Deploy the contracts to Lens Testnet:

```bash
yarn hardhat deploy-zksync --script deploy/deploy-all-contracts.ts --network lensTestnet
```

After deployment, record the contract addresses in your `.env` file.

4. Verify the deployed contracts:

```bash
yarn hardhat deploy-zksync --script deploy/verify-contracts.ts --network lensTestnet
```

## Testing

Run tests with:

```bash
yarn test
```

## Contracts Structure

- `contracts/`: Main contract files
- `mocks/`: Mock contracts for testing
- `interfaces/`: Interface definitions

## License

MIT

# Lens Protocol Contracts Deployment

This repository contains smart contracts designed to work with the Lens Protocol v3, including post actions, prediction markets, and more.

## Deployment Process

### Prerequisites

1. Make sure you have Node.js >= v20 installed
2. Install all dependencies:
```
npm install
```

3. Create a `.env` file with your private key:
```
PRIVATE_KEY=your_private_key_here
```

### Deployment Steps

The deployment process has been set up, but there are some current limitations:

1. Compile the contracts:
```
npx hardhat compile
```

2. Deploy contracts to Lens Testnet:
```
npx hardhat run deploy/001_deploy_contracts.js --network lensTestnet
```

#### Contracts to be Deployed

* `MockActionHub`: A mock implementation of the Lens Protocol Action Hub
* `MockERC20`: A token for staking in the prediction market
* `PredictionMarket`: A prediction market contract integrated with Lens
* `QuadraticVoting`: A quadratic voting implementation for market resolution
* `PredictLensSmartMedia`: A smart media contract for prediction markets

### Current Deployment Issues

The following issues were encountered during the deployment process:

1. **Plugin Compatibility**: The `hardhat-zksync-deploy` plugin is having issues with the deployment scripts in TypeScript format.

2. **Direct Hardhat Run**: When using `npx hardhat run` to execute the deployment script, the script is executed but no output is displayed.

3. **Environment Configuration**: There might be issues with the configuration of the Lens Network in the deployment environment.

### Troubleshooting

To troubleshoot the deployment:

1. Check that your private key is set correctly in the .env file
2. Make sure that your account has enough GRASS tokens from the faucet
3. Try using the `hardhat-zksync:contract` task to deploy individual contracts:
```
npx hardhat deploy-zksync:contract --contract-name MockActionHub --network lensTestnet
```

### Next Steps

To continue the deployment process:

1. Create a more resilient deployment script that handles network-specific issues
2. Add verification steps for deployed contracts
3. Set up a local testing environment to test the contracts before deployment
4. Update to latest versions of all dependencies

## Contract Architecture

The contracts in this repository implement Lens Protocol v3 post actions and include:

* **Types.sol**: Common types used across Lens Protocol v3
* **IPostAction.sol**: Interface for Post Actions in Lens Protocol v3
* **Constants.sol**: Constants used in Lens Protocol v3
* **PredictionMarket.sol**: Implementation of prediction markets
* **QuadraticVoting.sol**: Implementation of quadratic voting
* **PredictLensSmartMedia.sol**: Smart media implementation for prediction markets

## Resources

* [Lens Protocol Documentation](https://lens.xyz/docs)
* [Lens Chain Documentation](https://blog.availproject.org/lens-chain-goes-live-scaling-socialfi-with-avail-and-zksync/)
* [Hardhat ZKSync Documentation](https://docs.zksync.io/zksync-era/tooling/hardhat/plugins/hardhat-zksync-deploy)
* [Lens v3 Protocol Reference](https://github.com/lens-protocol/lens-network-hardhat-boilerplate)
