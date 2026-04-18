use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

pub mod instructions;
pub mod state;
pub mod errors;
pub mod constants;

use instructions::*;

#[program]
pub mod astra_registry {
    use super::*;

    pub fn register_wallet(ctx: Context<RegisterWallet>, user_id: String) -> Result<()> {
        instructions::register_wallet::handler(ctx, user_id)
    }

    pub fn update_wallet(ctx: Context<UpdateWallet>, new_user_id: String) -> Result<()> {
        instructions::update_wallet::handler(ctx, new_user_id)
    }

    pub fn deregister_wallet(ctx: Context<DeregisterWallet>) -> Result<()> {
        instructions::deregister_wallet::handler(ctx)
    }
}
