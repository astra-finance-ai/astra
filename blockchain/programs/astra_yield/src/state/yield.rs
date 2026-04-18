use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct YieldRecord {
    pub pool: Pubkey,               // ref to AssetPool
    pub total_yield_deposited: u64, // total USDC yield deposited by platform
    pub total_yield_claimed: u64,   // total claimed by all investors
    pub yield_per_token: u64,       // accumulated yield per position token (fixed point)
    pub last_yield_deposit: i64,    // timestamp of last yield deposit
    pub deposit_count: u32,         // number of yield deposits made
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct ClaimReceipt {
    pub yield_record: Pubkey,
    pub investor: Pubkey,
    pub position: Pubkey,
    pub yield_per_token_at_last_claim: u64, // used to calculate new yield since last claim
    pub total_claimed: u64,
    pub last_claim_at: i64,
    pub claim_count: u32,
    pub bump: u8,
}
