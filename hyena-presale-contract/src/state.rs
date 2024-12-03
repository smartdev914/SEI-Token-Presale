use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cw_storage_plus::Item;
use cw_storage_plus::Map;
use cosmwasm_std::Addr;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct PresalePhase {
    pub price_per_token: u128,
    pub start_time: u64,  // UNIX timestamp for start time
    pub end_time: u64,    // UNIX timestamp for end time
    pub claim_start_time: u64,  // UNIX timestamp for claim start time
    pub claim_end_time: u64,    // UNIX timestamp for claim end time
    pub max_tokens: u128, // Maximum tokens available for this phase
    pub sold_token_amount: u128,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct PresaleInfo {
    pub admin_address: Addr,
    // Mint address of the presale token
    pub token_mint_address: Addr,
    // Softcap
    pub softcap_amount: u128,
    // Hardcap
    pub hardcap_amount: u128,
    pub total_earned_usdt: u128,
    pub total_earned_sei: u128,
    pub usdt_denom: String,
    pub sei_denom: String,
    pub phases: Vec<PresalePhase>,
}


pub const PRESALEINFO: Item<PresaleInfo> = Item::new("presaleInfo");


pub const USERS: Map<Addr, Vec<u128>> = Map::new("buyers");