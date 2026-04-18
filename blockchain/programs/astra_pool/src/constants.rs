use anchor_lang::prelude::*;

pub const SEED_PREFIX: &str = "asset_pool";
pub const INVESTOR_POSITION_SEED: &str = "investor_position";

// 500 USDC (6 decimals)
pub const MIN_INVESTMENT_USDC: u64 = 500_000_000;

// Position token scale for pro-rata calculations
pub const POSITION_TOKEN_SCALE: u64 = 1_000_000;
pub const POSITION_TOKEN_DECIMALS: u8 = 6;

// Max investors per pool
pub const MAX_INVESTORS_PER_POOL: u32 = 10_000;

// Oracle staleness threshold (seconds)
pub const ORACLE_STALENESS_THRESHOLD: i64 = 60;

// USDC mint addresses
#[cfg(feature = "devnet")]
pub const USDC_MINT: &str = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";

#[cfg(feature = "mainnet")]
pub const USDC_MINT: &str = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

// Default to devnet if no feature specified
#[cfg(not(any(feature = "devnet", feature = "mainnet")))]
pub const USDC_MINT: &str = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";
