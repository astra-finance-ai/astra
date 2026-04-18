use anchor_lang::prelude::*;

#[error_code]
pub enum PoolError {
    #[msg("Pool is not active")]
    PoolNotActive,
    #[msg("Pool is paused")]
    PoolPaused,
    #[msg("Pool is closed")]
    PoolClosed,
    #[msg("Investment amount below minimum")]
    BelowMinimumInvestment,
    #[msg("Investment would exceed pool target")]
    ExceedsPoolTarget,
    #[msg("Investor wallet not registered")]
    WalletNotRegistered,
    #[msg("Lock period has not expired")]
    LockPeriodActive,
    #[msg("Unauthorized: must be pool authority")]
    Unauthorized,
    #[msg("Oracle price is stale")]
    StaleOraclePrice,
    #[msg("Outstanding yield must be claimed before withdrawal")]
    OutstandingYield,
    #[msg("Arithmetic overflow")]
    MathOverflow,
}
