export type MarketData = [
  resolved: boolean,
  outcome1Token: `0x${string}`,
  outcome2Token: `0x${string}`,
  outcome1: `0x${string}`,
  outcome2: `0x${string}`,
]

export type PoolData = {
  marketId: `0x${string}`
  pool: `0x${string}`
  tokenA: `0x${string}`
  tokenB: `0x${string}`
  fee: number
  poolInitialized: boolean
}

export const USDC_ADDRESS: `0x${string}` = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";

const PREDICTION_MARKET_ADDRESS: `0x${string}` = "0x1d8A4f3abacfE2eD80dd576db7f5c62239F25c98";
const UNISWAP_V3_AMM_ADDRESS: `0x${string}` = "0x34b5Fe022535Ff7d82dD44fe63eBd1135A9eB2C5";

const PREDICTION_MARKET_ABI = [{"inputs":[{"internalType":"address","name":"_finder","type":"address"},{"internalType":"address","name":"_currency","type":"address"},{"internalType":"address","name":"_optimisticOracleV3","type":"address"},{"internalType":"address","name":"_ammContract","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"PredictionMarket__AssertionActiveOrResolved","type":"error"},{"inputs":[],"name":"PredictionMarket__EmptyDescription","type":"error"},{"inputs":[],"name":"PredictionMarket__EmptyOutcome","type":"error"},{"inputs":[],"name":"PredictionMarket__InvalidAssertionOutcome","type":"error"},{"inputs":[],"name":"PredictionMarket__MarketAlreadyExists","type":"error"},{"inputs":[],"name":"PredictionMarket__MarketDoesNotExist","type":"error"},{"inputs":[],"name":"PredictionMarket__MarketNotResolved","type":"error"},{"inputs":[],"name":"PredictionMarket__NotAuthorized","type":"error"},{"inputs":[],"name":"PredictionMarket__OutcomesAreTheSame","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"marketId","type":"bytes32"},{"indexed":true,"internalType":"string","name":"assertedOutcome","type":"string"},{"indexed":true,"internalType":"bytes32","name":"assertionId","type":"bytes32"}],"name":"MarketAsserted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"marketId","type":"bytes32"},{"indexed":true,"internalType":"string","name":"outcome1","type":"string"},{"indexed":true,"internalType":"string","name":"outcome2","type":"string"},{"indexed":false,"internalType":"string","name":"description","type":"string"},{"indexed":false,"internalType":"address","name":"outcome1Token","type":"address"},{"indexed":false,"internalType":"address","name":"outcome2Token","type":"address"},{"indexed":false,"internalType":"uint256","name":"reward","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"requiredBond","type":"uint256"},{"indexed":false,"internalType":"uint24","name":"poolFee","type":"uint24"}],"name":"MarketInitialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"marketId","type":"bytes32"}],"name":"MarketResolved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"marketId","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokensCreated","type":"uint256"}],"name":"TokensCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"marketId","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokensRedeemed","type":"uint256"}],"name":"TokensRedeemed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"marketId","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"uint256","name":"payout","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"outcome1Tokens","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"outcome2Tokens","type":"uint256"}],"name":"TokensSettled","type":"event"},{"inputs":[],"name":"amm","outputs":[{"internalType":"contract UniswapV3AMMContract","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"marketId","type":"bytes32"},{"internalType":"string","name":"assertedOutcome","type":"string"}],"name":"assertMarket","outputs":[{"internalType":"bytes32","name":"assertionId","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"assertionId","type":"bytes32"}],"name":"assertionDisputedCallback","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"assertionId","type":"bytes32"},{"internalType":"bool","name":"assertedTruthfully","type":"bool"}],"name":"assertionResolvedCallback","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"marketId","type":"bytes32"},{"internalType":"uint256","name":"tokensToCreate","type":"uint256"}],"name":"createOutcomeTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"finder","outputs":[{"internalType":"contract FinderInterface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAssertionLiveness","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"getCurrency","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getDefaultIdentifier","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"marketId","type":"bytes32"}],"name":"getMarket","outputs":[{"internalType":"bool","name":"resolved","type":"bool"},{"internalType":"address","name":"outcome1Token","type":"address"},{"internalType":"address","name":"outcome2Token","type":"address"},{"internalType":"bytes","name":"outcome1","type":"bytes"},{"internalType":"bytes","name":"outcome2","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getUnresolvableOutcome","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"string","name":"outcome1","type":"string"},{"internalType":"string","name":"outcome2","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"uint256","name":"reward","type":"uint256"},{"internalType":"uint256","name":"requiredBond","type":"uint256"},{"internalType":"uint24","name":"poolFee","type":"uint24"}],"name":"initializeMarket","outputs":[{"internalType":"bytes32","name":"marketId","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"optimisticOracle","outputs":[{"internalType":"contract OptimisticOracleV3Interface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"marketId","type":"bytes32"},{"internalType":"uint256","name":"tokensToRedeem","type":"uint256"}],"name":"redeemOutcomeTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"marketId","type":"bytes32"}],"name":"settleOutcomeTokens","outputs":[{"internalType":"uint256","name":"payout","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const UNISWAP_V3_AMM_ABI = [{"inputs":[{"internalType":"address","name":"_uniswapV3Factory","type":"address"},{"internalType":"address","name":"_swapRouter","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"recipient","type":"address"},{"indexed":true,"internalType":"bytes32","name":"marketId","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"amountA","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountB","type":"uint256"}],"name":"FeeCollected","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"marketId","type":"bytes32"},{"indexed":true,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"LiquidityAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"marketId","type":"bytes32"},{"indexed":true,"internalType":"uint128","name":"liquidity","type":"uint128"}],"name":"LiquidityRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"marketId","type":"bytes32"},{"indexed":true,"internalType":"address","name":"pool","type":"address"},{"indexed":false,"internalType":"address","name":"tokenA","type":"address"},{"indexed":false,"internalType":"address","name":"tokenB","type":"address"},{"indexed":false,"internalType":"uint24","name":"fee","type":"uint24"}],"name":"PoolInitialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountA","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountB","type":"uint256"}],"name":"ProtocolFeeCollected","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"marketId","type":"bytes32"},{"indexed":true,"internalType":"address","name":"tokenIn","type":"address"},{"indexed":true,"internalType":"address","name":"tokenOut","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountIn","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountOut","type":"uint256"}],"name":"TokensSwapped","type":"event"},{"inputs":[{"internalType":"bytes32","name":"_marketId","type":"bytes32"},{"internalType":"uint256","name":"_amount0","type":"uint256"},{"internalType":"uint256","name":"_amount1","type":"uint256"},{"internalType":"int24","name":"_tickLower","type":"int24"},{"internalType":"int24","name":"_tickUpper","type":"int24"}],"name":"addLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"addressToPool","outputs":[{"internalType":"bytes32","name":"marketId","type":"bytes32"},{"internalType":"address","name":"pool","type":"address"},{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"bool","name":"poolInitialized","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"marketId","type":"bytes32"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"int24","name":"tickLower","type":"int24"},{"internalType":"int24","name":"tickUpper","type":"int24"},{"internalType":"uint128","name":"amount0Requested","type":"uint128"},{"internalType":"uint128","name":"amount1Requested","type":"uint128"}],"name":"collectFee","outputs":[{"internalType":"uint128","name":"amount0","type":"uint128"},{"internalType":"uint128","name":"amount1","type":"uint128"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint128","name":"tokenA","type":"uint128"},{"internalType":"uint128","name":"tokenB","type":"uint128"}],"name":"collectProtocolFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"directPools","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAllPools","outputs":[{"components":[{"internalType":"bytes32","name":"marketId","type":"bytes32"},{"internalType":"address","name":"pool","type":"address"},{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"bool","name":"poolInitialized","type":"bool"}],"internalType":"struct UniswapV3AMMContract.PoolData[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"poolAddress","type":"address"}],"name":"getPoolUsingAddress","outputs":[{"components":[{"internalType":"bytes32","name":"marketId","type":"bytes32"},{"internalType":"address","name":"pool","type":"address"},{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"bool","name":"poolInitialized","type":"bool"}],"internalType":"struct UniswapV3AMMContract.PoolData","name":"pool","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"marketId","type":"bytes32"}],"name":"getPoolUsingMarketId","outputs":[{"components":[{"internalType":"bytes32","name":"marketId","type":"bytes32"},{"internalType":"address","name":"pool","type":"address"},{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"bool","name":"poolInitialized","type":"bool"}],"internalType":"struct UniswapV3AMMContract.PoolData","name":"pool","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"}],"name":"getPoolUsingParams","outputs":[{"internalType":"address","name":"pool","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenA","type":"address"},{"internalType":"address","name":"_tokenB","type":"address"},{"internalType":"uint24","name":"_fee","type":"uint24"},{"internalType":"bytes32","name":"_marketId","type":"bytes32"}],"name":"initializePool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"magicFactory","outputs":[{"internalType":"contract IUniswapV3Factory","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"marketPools","outputs":[{"internalType":"bytes32","name":"marketId","type":"bytes32"},{"internalType":"address","name":"pool","type":"address"},{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"bool","name":"poolInitialized","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"pools","outputs":[{"internalType":"bytes32","name":"marketId","type":"bytes32"},{"internalType":"address","name":"pool","type":"address"},{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"bool","name":"poolInitialized","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_marketId","type":"bytes32"},{"internalType":"uint128","name":"_liquidity","type":"uint128"},{"internalType":"int24","name":"_tickLower","type":"int24"},{"internalType":"int24","name":"_tickUpper","type":"int24"}],"name":"removeLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_marketId","type":"bytes32"},{"internalType":"uint256","name":"_amountIn","type":"uint256"},{"internalType":"uint256","name":"_amountOutMinimum","type":"uint256"},{"internalType":"bool","name":"_zeroForOne","type":"bool"}],"name":"swap","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"swapRouter","outputs":[{"internalType":"contract ISwapRouter","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];

export const PREDICTION_MARKET_CONTRACT = {
  address: PREDICTION_MARKET_ADDRESS,
  abi: PREDICTION_MARKET_ABI,
};

export const UNISWAP_V3_AMM_CONTRACT = {
  address: UNISWAP_V3_AMM_ADDRESS,
  abi: UNISWAP_V3_AMM_ABI,
};

// Add these new ABIs
const UNISWAP_V3_POOL_ABI = [{
  "inputs": [],
  "name": "slot0",
  "outputs": [
    { "internalType": "uint160", "name": "sqrtPriceX96", "type": "uint160" },
    { "internalType": "int24", "name": "tick", "type": "int24" },
    { "internalType": "uint16", "name": "observationIndex", "type": "uint16" },
    { "internalType": "uint16", "name": "observationCardinality", "type": "uint16" },
    { "internalType": "uint16", "name": "observationCardinalityNext", "type": "uint16" },
    { "internalType": "uint8", "name": "feeProtocol", "type": "uint8" },
    { "internalType": "bool", "name": "unlocked", "type": "bool" }
  ],
  "stateMutability": "view",
  "type": "function"
}];

export const UNISWAP_V3_POOL = {
  abi: UNISWAP_V3_POOL_ABI,
};
