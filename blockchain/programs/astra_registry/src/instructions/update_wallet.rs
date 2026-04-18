use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::RegistryError;
use crate::constants::SEED_PREFIX;

#[derive(Accounts)]
pub struct UpdateWallet<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        mut,
        seeds = [SEED_PREFIX.as_bytes(), user.key().as_ref()],
        bump
    )]
    pub user_registry: Account<'info, UserRegistry>,
}

pub fn handler(ctx: Context<UpdateWallet>, new_user_id: String) -> Result<()> {
    let registry = &mut ctx.accounts.user_registry;
    
    // Verify signer matches the registered wallet
    require!(ctx.accounts.user.key() == registry.wallet, RegistryError::Unauthorized);
    
    // Update user_id
    let user_id_bytes = new_user_id.as_bytes();
    require!(user_id_bytes.len() >= 36, RegistryError::AlreadyRegistered);
    
    let mut id_array = [0u8; 36];
    id_array.copy_from_slice(&user_id_bytes[0..36]);
    
    registry.user_id = id_array;
    
    Ok(())
}
