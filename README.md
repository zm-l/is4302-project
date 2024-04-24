# VeriAstraea: Decentralized Truth Verification for Twitter
<p align="center">
    <img src="frontend/public/VeriAstrea.jpg" width="300" height="300">
</p>

## About VeriAstraea
VeriAstraea is a decentralized application developed on the Ethereum blockchain, drawing inspiration from the [Astraea: A Decentralized Blockchain Oracle](https://blockchain.ieee.org/technicalbriefs/march-2019/astraea-a-decentralized-blockchain-oracle) paper. Its primary objective is to provide a trustworthy and transparent mechanism for validating the accuracy of Twitter posts, thereby combating the proliferation of misinformation and fake news on social media platforms.

## Features

1. **Submit Twitter Post:** Users can submit URLs of Twitter posts to the VeriAstrea platform along with a specified bounty amount to incentivize verification.
  
2. **Certify Posts:** Certifiers stake a higher quantity of Karma Tokens to certify the truthfulness of submitted Twitter posts of their choosing based on their expertise and research.
  
3. **Vote on Posts:** Voters stake a portion of their Karma Tokens to cast votes on the veracity of a randomly selected Twitter posts.


## Technologies Used
- **React**: Frontend development
- **Chakra UI**: Component library for UI design
- **Solidity**: Smart contract development for Ethereum blockchain
- **Node.js**: Backend server development

## Getting Started

### Prerequisites
- npm
    ```bash
    npm install
    ```
### Running the app locally
All three processes (frontend, backend and hardhat) should be running at the same time.

1. Setup frontend on localhost:3000
    ```bash
    cd is4302-project/frontend
    npm install
    npm start
    ```

2. Setup backend on localhost:5000
   1. Running the backend server
        ```bash
        cd is4302-project/backend
        npm install
        node server.js
        ```
    2. Create a `.env` file with your Twitter API key.
       ```
       TWITTER_CONSUMER_KEY="*"
       TWITTER_CONSUMER_SECRET="*"
       TWITTER_ACCESS_TOKEN_KEY="*"
       TWITTER_ACCESS_TOKEN_SECRET="*"
       ```
    3. Alternatively, if you do not have a valid Twitter API key, you can return a dummy response. Instructions are provided as comments in the `is4302-project/server.js` file.

4. Setup hardhat
    1. Navigate to the project directory:
        ```bash
        cd is4302-project
        ```
    
    2. Compile the contracts using Hardhat:
        ```bash
        npx hardhat compile
        ```
    
    3. To deploy the contracts to a local Ethereum network, start a local Hardhat node:
        ```bash
        npx hardhat node
        ```
    
    4. In a separate terminal, deploy the contracts to the local network:
        ```bash
        npx hardhat run scripts/deploy.js --network localhost
        ```
    5. After deploying the contracts, update the contract address in the frontend application. Replace the existing contract address in `is4302-project/frontend/src/Constant/constant.js` with the new one generated during deployment. 
        
## Contribution Guidelines

If you're interested in contributing to VeriAstrea, please follow these guidelines:

- Fork the repository and create your branch from `main`.
- Ensure any new code is well-tested and documented.
- Submit a pull request with a detailed description of the changes.

## License

This project is licensed under the MIT License.

