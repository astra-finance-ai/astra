use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::RegistryError;
use crate::constants::SEED_PREFIX;

#[derive(Accounts)]
pub struct RegisterWallet<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        init,
        payer = user,
        space = 8 + UserRegistry::INIT_SPACE,
        seeds = [SEED_PREFIX.as_bytes(), user.key().as_ref()],
        bump
    )]
    pub user_registry: Account<'info, UserRegistry>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<RegisterWallet>, user_id: String) -> Result<()> {
    let registry = &mut ctx.accounts.user_registry;
    
    // Convert user_id string to bytes (assuming UUID v4 format)
    let user_id_bytes = user_id.as_bytes();
    require!(user_id_bytes.len() >= 36, RegistryError::AlreadyRegistered);
    
    let mut id_array = [0u8; 36];
    id_array.copy_from_slice(&user_id_bytes[0..36]);
    
    registry.user_id = id_array;
    registry.wallet = ctx.accounts.user.key();
    registry.registered_at = Clock::get()?.unix_timestamp;
    registry.is_active = true;
    registry.bump = ctx.bumps.user_registry;
    
    emit!(WalletRegistered {
        user_id,
        wallet: ctx.accounts.user.key(),
        timestamp: registry.registered_at,
    });
    
    Ok(())
}

#[event]
pub struct WalletRegistered {
    pub user_id: String,
    pub wallet: Pubkey,
    pub timestamp: i64,
}
