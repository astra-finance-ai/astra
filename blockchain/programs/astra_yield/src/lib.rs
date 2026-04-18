use anchor_lang::prelude::*;

declare_id!("JcKz9NqR8tU2vW3xY4zA5bC6dE7fF8gG9hH0iI1jJ2k");

pub mod instructions;
pub mod state;
pub mod errors;
pub mod constants;

use instructions::*;

#[program]
pub mod astra_yield {
    use super::*;

    pub fn record_yield(ctx: Context<RecordYield>, amount: u64) -> Result<()> {
        instructions::record_yield::handler(ctx, amount)
    }

    pub fn claim_yield(ctx: Context<ClaimYield>) -> Result<()> {
        instructions::claim_yield::handler(ctx)
    }

    pub fn update_yield_rate(ctx: Context<UpdateYieldRate>, new_rate: u64) -> Result<()> {
        instructions::update_yield_rate::handler(ctx, new_rate)
    }
}
