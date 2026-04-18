use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct UserRegistry {
    pub user_id: [u8; 36],          // MongoDB user ID as bytes (UUID v4)
    pub wallet: Pubkey,             // user's Phantom wallet public key
    pub registered_at: i64,        // Unix timestamp
    pub is_active: bool,
    pub bump: u8,
}
