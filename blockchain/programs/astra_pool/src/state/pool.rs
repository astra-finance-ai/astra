use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct AssetPool {
    pub asset_id: [u8; 36],         // Astra platform asset ID (UUID)
    pub pool_authority: Pubkey,     // Squads multisig address
    pub usdc_mint: Pubkey,          // USDC mint address (devnet/mainnet)
    pub position_token_mint: Pubkey, // SPL token mint for this asset's shares
    pub pool_usdc_vault: Pubkey,    // pool's USDC token account (holds funds)
    pub pool_sol_vault: Pubkey,     // pool's SOL vault (holds SOL investments)
    pub total_raised_usdc: u64,     // total USDC raised (in lamports equivalent)
    pub total_raised_sol: u64,      // total SOL raised (in lamports)
    pub target_amount_usdc: u64,    // funding target in USDC
    pub total_investors: u32,
    pub total_position_tokens: u64, // total supply of position tokens minted
    pub is_active: bool,            // accepting investments
    pub is_paused: bool,            // emergency pause
    pub is_closed: bool,            // pool permanently closed
    pub created_at: i64,
    pub lock_period_days: u16,      // minimum hold period (e.g. 180 days)
    pub bump: u8,
    pub vault_bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct InvestorPosition {
    pub pool: Pubkey,               // ref to AssetPool
    pub investor: Pubkey,           // investor wallet public key
    pub user_registry: Pubkey,      // ref to UserRegistry
    pub invested_usdc: u64,         // amount invested in USDC (0 if SOL investment)
    pub invested_sol: u64,          // amount invested in SOL (0 if USDC investment)
    pub invested_usdc_equivalent: u64, // SOL investments converted to USD at time of investment
    pub position_tokens: u64,       // SPL position tokens held
    pub investment_currency: u8,    // 0 = USDC, 1 = SOL
    pub invested_at: i64,           // Unix timestamp of investment
    pub lock_expires_at: i64,       // invested_at + lock_period_days
    pub yield_claimed: u64,         // total yield claimed so far
    pub last_claim_at: i64,
    pub is_active: bool,
    pub bump: u8,
}
