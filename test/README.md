## Workflow
1. User connects their account using Metamask
2. They register as a player

## Assumptions

## Test Case Documentation

### Test Cases for full workflow (ASTRAEA)
1. Register Players:
    - Verify that new players can be registered successfully.
    - Ensure that a player cannot be registered twice.
2. Get KarmaTokens:
    - Test that players can obtain KarmaTokens.
    - Check that adding a proposition requires sufficient KarmaTokens.
3. Add Proposition:
    - Confirm that players can add propositions.
4. Vote on Proposition:
    - Test voting functionality on a proposition.
    - Check that player stakes increase upon voting.
5. Certify Proposition:
    - Verify that players can certify propositions.
6. Decide Proposition and Distribute Rewards:
    - Simulate the process of deciding a proposition by voting and certifying.
    - Ensure rewards are correctly distributed to players involved in the process.

### Test Cases for KarmaToken
1. Verify Contract Initialization:
    - Checks if the contract initializes with the correct name, symbol, and initial supply.
2. Mint Tokens to Account:
    - Tests the minting functionality by minting tokens to a specific account.
    - Verifies that the Transfer event is emitted correctly.
    - Ensures the account's balance matches the minted amount.
3. Burn Tokens from Account:
    - Tests the burning functionality by burning tokens from an account.
    - Verifies that the Transfer event is emitted correctly.
    - Ensures the account's balance is reduced by the burned amount.
4. Prevent Excessive Burning:
    - Validates that attempting to burn more tokens than an account has results in a revert.
5. Check Account Balance:
    - Verifies that the balance of an account matches the expected amount after minting tokens to it.

## Instructions to run test cases
1. Ensure that node.js is installed
2. Install all dependencies\
`npm install`
3. Compile using hardhat\
`npx hardhat compile`
4. Start hardhat\
`npx hardhat node`
5. Run all test cases\
`npx hardhat test`
