use anchor_lang::prelude::*;

declare_id!("HbXv3NqZ8KqJ9yYmF4pG2sR7tU1wV5xW6zA8bC9dE0fF");

pub mod instructions;
pub mod state;
pub mod errors;
pub mod constants;

use instructions::*;

#[program]
pub mod astra_pool {
    use super::*;

    pub fn initialize_pool(
        ctx: Context<InitializePool>,
        asset_id: String,
        target_amount_usdc: u64,
        lock_period_days: u16,
    ) -> Result<()> {
        instructions::initialize_pool::handler(ctx, asset_id, target_amount_usdc, lock_period_days)
    }

    pub fn invest_usdc(ctx: Context<InvestUsdc>, amount: u64) -> Result<()> {
        instructions::invest_usdc::handler(ctx, amount)
    }

    pub fn invest_sol(ctx: Context<InvestSol>, sol_price_usd: u64) -> Result<()> {
        instructions::invest_sol::handler(ctx, sol_price_usd)
    }

    pub fn withdraw_position(ctx: Context<WithdrawPosition>) -> Result<()> {
        instructions::withdraw_position::handler(ctx)
    }

    pub fn pause_pool(ctx: Context<PausePool>) -> Result<()> {
        instructions::pause_pool::handler(ctx)
    }

    pub fn close_pool(ctx: Context<ClosePool>) -> Result<()> {
        instructions::close_pool::handler(ctx)
    }
}
