use anchor_lang::prelude::*;

#[error_code]
pub enum RegistryError {
    #[msg("Wallet is already registered")]
    AlreadyRegistered,
    #[msg("Cannot deregister wallet with active positions")]
    ActivePositionsExist,
    #[msg("Unauthorized: signer does not match registry wallet")]
    Unauthorized,
}
