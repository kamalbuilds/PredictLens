# PredictLens Architecture

PredictLens is a decentralized prediction market platform built on Lens Protocol and enhanced with Bonsai Smart Media capabilities. This document outlines the system architecture and components.

## System Overview

PredictLens enables users to create, join, and resolve prediction markets directly within the Lens social graph. The platform leverages quadratic voting for fair outcome resolution and incorporates AI-driven dynamic content through Bonsai Smart Media.

### Key Components

1. **Smart Contracts**
   - `PredictionMarket.sol`: Core contract implementing the Lens Open Action interface to create and interact with markets
   - `QuadraticVoting.sol`: Contract implementing quadratic voting mechanisms for fair market resolution
   - `PredictLensSmartMedia.sol`: Contract for Bonsai Smart Media integration to enable dynamic, AI-powered market content

2. **Frontend Application**
   - Built with Next.js 15, TypeScript, and Tailwind CSS 4
   - Integrates with Lens Protocol client libraries
   - Uses ConnectKit and wagmi for wallet connection
   - Implements Shadcn UI components for consistent, accessible UI

3. **Key Pages**
   - Home: Landing page with features and call-to-action
   - Markets: Browse and filter prediction markets
   - Market Detail: View and participate in a specific market
   - Templates: Browse and select Bonsai Smart Media templates
   - Create Market: Form to create new markets
   - Profile: View user activity and created markets/templates

## Contract Architecture

### PredictionMarket.sol

This contract implements the `IPublicationActionModule` interface to integrate with Lens Protocol's Open Actions system. Key features:

- Market creation through Lens posts
- Staking on market outcomes directly in the Lens feed
- Creator fees for market creation
- Transparent, on-chain resolution and reward distribution

### QuadraticVoting.sol

This contract implements a quadratic voting mechanism to ensure fair market resolution, preventing wealthy participants from dominating outcomes. Key features:

- Quadratic cost structure for votes
- Democratic resolution through community voting
- One user, one voice principle through quadratic scaling

### PredictLensSmartMedia.sol

This contract enables integration with Bonsai Smart Media Protocol for dynamic, AI-powered content. Key features:

- Smart Media template management
- Dynamic content updates based on market activity
- Participant tracking and engagement metrics

## Data Flow

1. **Market Creation**:
   - User selects a Smart Media template
   - User defines market parameters (question, options, end time)
   - System creates a Lens post with attached Open Action
   - Smart contracts initialize the market state

2. **Market Participation**:
   - Users browse markets in their Lens feed
   - Users stake tokens on predicted outcomes
   - Smart contracts record stakes and update market state
   - Dynamic content updates through Bonsai Smart Media

3. **Market Resolution**:
   - After market end time, resolution begins
   - Quadratic voting period may be initiated for contentious markets
   - Smart contracts determine the winning outcome
   - Winners can claim rewards based on their stake proportion

## Integration Points

1. **Lens Protocol**:
   - Social graph for user discovery and interaction
   - Open Actions for market creation and participation
   - Posts and comments for market discussion

2. **Bonsai Smart Media**:
   - Templates for dynamic market content
   - AI-driven updates and insights
   - Enhanced user engagement through interactive elements

3. **Lens Chain**:
   - Fast, low-cost transactions for market operations
   - On-chain storage of market states
   - Secure, transparent execution of prediction market logic

## Deployment Architecture

The system is deployed on Lens Chain with the following configuration:

1. **Smart Contracts**: Deployed on Lens Chain
2. **Frontend**: Hosted on Vercel or similar platform
3. **Media Storage**: Uses Lens Storage Nodes for decentralized content storage
4. **RPC Provider**: Alchemy API for reliable blockchain communication

## Future Enhancements

1. **Multi-option Markets**: Support for markets with more than two options
2. **Market Categories**: Enhanced categorization and discovery
3. **Advanced Analytics**: AI-powered market insights and predictions
4. **Automated Resolution**: Integration with oracles for automatic market resolution
5. **Mobile App**: Native mobile experience for improved usability 