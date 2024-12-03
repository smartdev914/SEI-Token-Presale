use crate::state::PresalePhase;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use cosmwasm_std::Addr;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
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

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    // Receive(Cw20ReceiveMsg),
    BuyToken { token_amount: u128 },
    ClaimToken {},
    WithdrawPayment { amount: u128, denom: String },
    SetAdminAddress { address: Addr },
    SetNthStartTime { order: usize, start_time: u64 },
    SetNthEndTime { order: usize, end_time: u64 },
    SetNthClaimStartTime { order: usize, start_time: u64 },
    SetNthClaimEndTime { order: usize, end_time: u64 },
    SetUsdtDenom {denom: String},
    SetSeiDenom {denom: String},
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    /* Returns the list of token addresses that were created with this contract */
    GetSeiValue {},
    GetPrice {},
    GetUserTokenAmount { account: Addr },
    GetRestTokenAmount {},
    GetCurrentPhase {},
    GetCurrentClaimPhase {},
    GetRestTime {},
    GetTotalTokens {},
    GetEndDate {},
    GetTokenPrice {},
    GetSoldTokenAmount {},
    GetAdminAdress {},
    GetNthStartTime { order: usize },
    GetNthEndTime { order: usize },
    GetNthClaimStartTime { order: usize },
    GetNthClaimEndTime { order: usize },
    GetSeiDenom {},
    GetUsdtDenom {},
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct MigrateMsg {}
