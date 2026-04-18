use anchor_lang::prelude::*;

pub const SEED_PREFIX: &str = "yield_record";
pub const CLAIM_RECEIPT_SEED: &str = "claim_receipt";

// Precision for fixed-point yield calculations (6 decimals)
pub const YIELD_PRECISION: u64 = 1_000_000;
