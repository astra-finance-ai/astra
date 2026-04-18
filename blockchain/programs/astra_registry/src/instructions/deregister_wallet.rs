use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::RegistryError;
use crate::constants::SEED_PREFIX;

#[derive(Accounts)]
pub struct DeregisterWallet<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        mut,
        seeds = [SEED_PREFIX.as_bytes(), user.key().as_ref()],
        bump,
        close = user
    )]
    pub user_registry: Account<'info, UserRegistry>,
}

pub fn handler(ctx: Context<DeregisterWallet>) -> Result<()> {
    let registry = &ctx.accounts.user_registry;
    
    // Verify signer matches the registered wallet
    require!(ctx.accounts.user.key() == registry.wallet, RegistryError::Unauthorized);
    
    // In production, check for active positions here before allowing deregistration
    // require!(!has_active_positions(registry.wallet), RegistryError::ActivePositionsExist);
    
    Ok(())
}
