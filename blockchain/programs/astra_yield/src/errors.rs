use anchor_lang::prelude::*;

#[error_code]
pub enum YieldError {
    #[msg("No yield available to claim")]
    NoYieldAvailable,
    #[msg("Unauthorized: must be pool authority")]
    Unauthorized,
    #[msg("Yield record does not match pool")]
    YieldPoolMismatch,
    #[msg("Arithmetic overflow in yield calculation")]
    MathOverflow,
    #[msg("Insufficient yield vault balance")]
    InsufficientYieldVault,
}
