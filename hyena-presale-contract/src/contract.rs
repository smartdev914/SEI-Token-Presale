use crate::error::ContractError;
use crate::msg::MigrateMsg;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state::{PresaleInfo, PresalePhase, PRESALEINFO, USERS};
#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    coin, to_json_binary, BankMsg, Binary, Coin, Decimal, Deps, DepsMut, Env, MessageInfo,
    Response, StdResult, Uint128, Addr,
};
use cw2::set_contract_version;
use cw20::Cw20ExecuteMsg;
use sei_cosmwasm::{ExchangeRatesResponse, SeiQuerier, SeiQueryWrapper};
use serde::{Deserialize, Serialize};
use std::vec;

/* Define contract name and version */
const CONTRACT_NAME: &str = "crates.io:presale-contract";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");
// const INSTANTIATE_REPLY_ID: u64 = 1;

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut<SeiQueryWrapper>,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    /* Define the initial configuration for this contract that way you can
    limit the type of coin you want to accept each time a token-factory is
    created and also which kind of token would you like to mint based on
    the code id of the contract deployed */

    let _state = PresaleInfo {
        admin_address: msg.admin_address,
        token_mint_address: msg.token_mint_address,
        softcap_amount: msg.softcap_amount,
        hardcap_amount: msg.hardcap_amount,
        total_earned_usdt: msg.total_earned_usdt,
        total_earned_sei: msg.total_earned_sei,
        usdt_denom: msg.usdt_denom,
        sei_denom: msg.sei_denom,
        phases: msg.phases,
    };

    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    PRESALEINFO.save(deps.storage, &_state)?;

    Ok(Response::new().add_attribute("method", "instantiate"))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut<SeiQueryWrapper>,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::BuyToken { token_amount } => buy_token(deps, env, info, token_amount),
        ExecuteMsg::WithdrawPayment {
            amount,
            denom,
        } => withdraw_payment(deps, env, info, amount, denom),
        ExecuteMsg::ClaimToken {} => claim_token(deps, env, info),
        ExecuteMsg::SetAdminAddress { address } => set_admin_address(deps, env, info, address),
        ExecuteMsg::SetNthStartTime { order, start_time } => {
            set_nth_start_time(deps, env, info, order, start_time)
        }
        ExecuteMsg::SetNthEndTime { order, end_time } => {
            set_nth_end_time(deps, env, info, order, end_time)
        },
        ExecuteMsg::SetNthClaimStartTime { order, start_time } => {
            set_nth_claim_start_time(deps, env, info, order, start_time)
        },
        ExecuteMsg::SetNthClaimEndTime { order, end_time } => {
            set_nth_claim_end_time(deps, env, info, order, end_time)
        },
        ExecuteMsg::SetUsdtDenom { denom } => {
            set_usdt_denom(deps, env, info, denom)
        },
        ExecuteMsg::SetSeiDenom { denom } => {
            set_sei_denom(deps, env, info, denom)
        },
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct SwapMsg {
    offer_asset: Coin,
    ask_asset_denom: String,
}

// Helper function to determine the current active presale phase
fn get_active_phase(deps: Deps<SeiQueryWrapper>, env: Env) -> StdResult<Option<PresalePhase>> {
    let state = PRESALEINFO.load(deps.storage)?;
    // let state: PresaleInfo = singleton_read(deps.storage, b"presaleinfo").load()?;
    let current_time = env.block.time.seconds();

    for phase in state.phases {
        if current_time >= phase.start_time && current_time <= phase.end_time {
            return Ok(Some(phase));
        }
    }
    Ok(None) // No active phase
}

fn convert_string_to_f64(input: &str) -> Result<f64, std::num::ParseFloatError> {
    input.parse::<f64>()
}

pub fn set_admin_address(
    deps: DepsMut<SeiQueryWrapper>,
    _env: Env,
    _info: MessageInfo,
    address: Addr,
) -> Result<Response, ContractError> {
    let mut presale_info = PRESALEINFO.may_load(deps.storage)?.unwrap();
    
    if presale_info.admin_address != _info.sender.clone().to_string() {
        return Err(ContractError::InvalidAdmin {});
    }

    presale_info.admin_address = address;
    PRESALEINFO.save(deps.storage, &presale_info)?;
    Ok(Response::new())
}

pub fn set_usdt_denom(
    deps: DepsMut<SeiQueryWrapper>,
    _env: Env,
    _info: MessageInfo,
    denom: String,
) -> Result<Response, ContractError> {
    let mut presale_info = PRESALEINFO.may_load(deps.storage)?.unwrap();
    
    if presale_info.admin_address != _info.sender.clone().to_string() {
        return Err(ContractError::InvalidAdmin {});
    }

    presale_info.usdt_denom = denom;
    PRESALEINFO.save(deps.storage, &presale_info)?;
    Ok(Response::new())
}

pub fn set_sei_denom(
    deps: DepsMut<SeiQueryWrapper>,
    _env: Env,
    _info: MessageInfo,
    denom: String,
) -> Result<Response, ContractError> {
    let mut presale_info = PRESALEINFO.may_load(deps.storage)?.unwrap();
    
    if presale_info.admin_address != _info.sender.clone().to_string() {
        return Err(ContractError::InvalidAdmin {});
    }

    presale_info.sei_denom = denom;
    PRESALEINFO.save(deps.storage, &presale_info)?;
    Ok(Response::new())
}

pub fn set_nth_start_time(
    deps: DepsMut<SeiQueryWrapper>,
    _env: Env,
    _info: MessageInfo,
    order: usize,
    start_time: u64,
) -> Result<Response, ContractError> {
    let mut presale_info = PRESALEINFO.may_load(deps.storage)?.unwrap();
    
    if presale_info.admin_address != _info.sender.clone().to_string() {
        return Err(ContractError::InvalidAdmin {});
    }

    if order < 1 && order > presale_info.phases.len() {
        return Err(ContractError::InvalidInput {});
    }

    presale_info.phases[order - 1].start_time = start_time;
    PRESALEINFO.save(deps.storage, &presale_info)?;
    Ok(Response::new())
}

pub fn set_nth_end_time(
    deps: DepsMut<SeiQueryWrapper>,
    _env: Env,
    _info: MessageInfo,
    order: usize,
    end_time: u64,
) -> Result<Response, ContractError> {
    let mut presale_info = PRESALEINFO.may_load(deps.storage)?.unwrap();
    
    if presale_info.admin_address != _info.sender.clone().to_string() {
        return Err(ContractError::InvalidAdmin {});
    }

    if order < 1 && order > presale_info.phases.len() {
        return Err(ContractError::InvalidInput {});
    }
    presale_info.phases[order - 1].end_time = end_time;
    PRESALEINFO.save(deps.storage, &presale_info)?;
    Ok(Response::new())
}

pub fn set_nth_claim_start_time(
    deps: DepsMut<SeiQueryWrapper>,
    _env: Env,
    _info: MessageInfo,
    order: usize,
    start_time: u64,
) -> Result<Response, ContractError> {
    let mut presale_info = PRESALEINFO.may_load(deps.storage)?.unwrap();
    
    if presale_info.admin_address != _info.sender.clone().to_string() {
        return Err(ContractError::InvalidAdmin {});
    }

    if order < 1 && order > presale_info.phases.len() {
        return Err(ContractError::InvalidInput {});
    }

    presale_info.phases[order - 1].claim_start_time = start_time;
    PRESALEINFO.save(deps.storage, &presale_info)?;
    Ok(Response::new())
}

pub fn set_nth_claim_end_time(
    deps: DepsMut<SeiQueryWrapper>,
    _env: Env,
    _info: MessageInfo,
    order: usize,
    end_time: u64,
) -> Result<Response, ContractError> {
    let mut presale_info = PRESALEINFO.may_load(deps.storage)?.unwrap();
    
    if presale_info.admin_address != _info.sender.clone().to_string() {
        return Err(ContractError::InvalidAdmin {});
    }

    if order < 1 && order > presale_info.phases.len() {
        return Err(ContractError::InvalidInput {});
    }
    presale_info.phases[order - 1].claim_end_time = end_time;
    PRESALEINFO.save(deps.storage, &presale_info)?;
    Ok(Response::new())
}

pub fn withdraw_payment(
    deps: DepsMut<SeiQueryWrapper>,
    _env: Env,
    _info: MessageInfo,
    amount: u128,
    denom: String,
) -> Result<Response, ContractError> {
    let presale_info = PRESALEINFO.may_load(deps.storage)?.unwrap();

    if presale_info.admin_address != _info.sender.clone().to_string() {
        return Err(ContractError::InvalidAdmin {});
    }

    let balance = deps
        .querier
        .query_balance(&_env.contract.address, denom.clone())?;

    if balance.amount < Uint128::from(amount) {
        return Err(ContractError::InvalidInput {});
    }

    let withdraw_amount = Coin {
        denom: denom.clone(),
        amount: amount.into(),
    };

    // Creating the bank message to send coins from the contract
    let bank_msg = BankMsg::Send {
        to_address: presale_info.admin_address.to_string(),
        amount: vec![withdraw_amount],
    };

    Ok(Response::new()
        .add_message(bank_msg)
        .add_attribute("action", "withdraw")
        .add_attribute("recipient", presale_info.admin_address.to_string())
        .add_attribute("amount", Uint128::from(amount).clone())
        .add_attribute("denom", denom))
}



pub fn buy_token(
    deps: DepsMut<SeiQueryWrapper>,
    _env: Env,
    _info: MessageInfo,
    token_amount: u128,
) -> Result<Response, ContractError> {
    // let mut presale_info = PRESALEINFO.load(deps.storage)?;
    let cur_timestamp = _env.block.time.seconds();
    let _funds = _info.funds[0].clone();
    let mut bank_msg: Option<BankMsg> = None; // Use Option to handle conditional initialization

    let mut state = PRESALEINFO.may_load(deps.storage)?.unwrap();

    let first_end_time = query_get_nth_end_time(deps.as_ref(), _env.clone(), 1).unwrap();
    let second_end_time = query_get_nth_end_time(deps.as_ref(), _env.clone(), 2).unwrap();
    let third_end_time = query_get_nth_end_time(deps.as_ref(), _env.clone(), 3).unwrap();
    // let second_end_time = query_get_nth_end(2);
    // let third_end_time = query_get_nth_end(3);

    for phase in &mut state.phases {
        //find current phase
        if cur_timestamp >= phase.start_time && cur_timestamp <= phase.end_time {
            if token_amount > phase.max_tokens - phase.sold_token_amount {
                return Err(ContractError::InvalidInput {});
            }
            //check denom
            if _funds.denom == state.sei_denom {
                let wrapped_deps = deps.as_ref();
                let sei_decimal = query_get_sei_value(wrapped_deps);
                let decimal_string = sei_decimal.unwrap().to_string();
                //check funds with sei
                match convert_string_to_f64(&decimal_string) {
                    Ok(decimal_float) => {
                        let value =
                            (phase.price_per_token * token_amount / 100) as f64 / decimal_float;
                        let required_coin = coin(value as u128, "usdt");
                        if _funds.amount < required_coin.amount {
                            {
                                return Err(ContractError::NotReceivedFunds {});
                            }
                        }

                        let send_amount = Coin {
                            denom: _funds.denom.clone(),
                            amount: _funds.amount - required_coin.amount,
                        };

                        bank_msg = Some(BankMsg::Send {
                            to_address: _info.sender.to_string(),
                            amount: vec![send_amount],
                        });

                        state.total_earned_sei += required_coin.amount.u128();
                    }
                    Err(_e) => return Err(ContractError::InvalidParse {}),
                }
            } else if _funds.denom == state.usdt_denom { //check funds with usdt
                // Calculate the cost
                let total_cost = coin((phase.price_per_token * token_amount / 100).into(), "usdt");
                if _funds.amount < total_cost.amount {
                    return Err(ContractError::InvalidUsdtFunds {});
                }
                state.total_earned_usdt += total_cost.amount.u128();
            } 
            else {
                return Err(ContractError::InvalidFunds {});
            }

            //update presale info
            phase.sold_token_amount += token_amount;
            //update user info
            let mut user = USERS.load(deps.storage, _info.sender.clone()).unwrap_or(vec![]);
            //user already exist
            if user.len() == 3 {
                if first_end_time == phase.end_time {
                    user[0] += token_amount;
                } 
                if second_end_time == phase.end_time {
                    user[1] += token_amount;
                } 
                if third_end_time == phase.end_time {
                    user[2] += token_amount;
                } 
                let res = USERS.save(deps.storage, _info.sender.clone(), &user);
                if res.is_err() {
                    return Err(ContractError::InvalidUserOperation {});
                }
            } 
            else { //user none exist
                let mut data: Vec<u128> = vec![0, 0, 0];
                let zero: u128 = 0;
                if first_end_time == phase.end_time {
                    data[0] = token_amount;
                    data[1] = zero;
                    data[2] = zero;
                } 
                if second_end_time == phase.end_time {
                    data[0] = zero;
                    data[1] = token_amount;
                    data[2] = zero;
                } 
                if third_end_time == phase.end_time {
                    data[0] = zero;
                    data[1] = zero;
                    data[2] = token_amount;
                } 
                USERS.save(deps.storage, _info.sender.clone(), &data)?;
            }
            
        }
    }
    PRESALEINFO.save(deps.storage, &state)?;
    match bank_msg {
        Some(msg) => Ok(Response::new().add_message(msg)),
        None => Ok(Response::new()),
    }
}

pub fn execute_transfer(
    _env: Env,
    _info: MessageInfo,
    amount: Uint128,
    token_address: Addr,
) -> Result<cosmwasm_std::CosmosMsg, ContractError> {
    // Create a CW20 transfer message
    let cw20_transfer_msg = Cw20ExecuteMsg::Transfer {
        recipient: _info.sender.clone().to_string(),
        amount,
    };

    // Create a Cosmos message to call the CW20 contract
    let cosmos_msg = cosmwasm_std::CosmosMsg::Wasm(cosmwasm_std::WasmMsg::Execute {
        contract_addr: token_address.clone().to_string(),
        msg: to_json_binary(&cw20_transfer_msg)?,
        funds: vec![],
    });

    return Ok(cosmos_msg);
}

pub fn claim_token(
    deps: DepsMut<SeiQueryWrapper>,
    _env: Env,
    _info: MessageInfo,
) -> Result<Response, ContractError> {
    let presale_info = PRESALEINFO.may_load(deps.storage)?.unwrap();
    let cur_timestamp = _env.block.time.seconds();

    let mut user = USERS.load(deps.storage, _info.sender.clone()).unwrap_or(vec![]);
    let mut claim_amount: u128 = 0;
    let mut i: usize = 0;

    for phase in presale_info.phases {
        if cur_timestamp >= phase.claim_start_time && cur_timestamp <= phase.claim_end_time {
            claim_amount = user[i];
            break;
        }
        i += 1;
    }
    //send tokens to user and remove tokens of user on contract
    if claim_amount > 0 {
        let msg = execute_transfer(_env,_info.clone(),
            Uint128::from(claim_amount), presale_info.token_mint_address.clone());
  
        user[i] = 0;
        USERS.save(deps.storage, _info.sender.clone(), &user)?;

        Ok(Response::new().add_message(msg?))
    }
    else {
        return Err(ContractError::InvalidTime {});
    }
}
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps<SeiQueryWrapper>, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        /* Return the list of all tokens that were minted thru this contract */
        QueryMsg::GetSeiValue {} => to_json_binary(&query_get_sei_value(deps)?),
        QueryMsg::GetPrice {} => to_json_binary(&query_get_usei_price(deps)?),
        QueryMsg::GetUserTokenAmount { account } => {
            to_json_binary(&query_get_user_token_amount(deps, _env, account)?)
        }
        QueryMsg::GetRestTokenAmount {} => {
            to_json_binary(&query_get_rest_token_amount(deps, _env)?)
        }
        QueryMsg::GetCurrentPhase {} => to_json_binary(&query_get_current_phase(deps, _env)?),
        QueryMsg::GetRestTime {} => to_json_binary(&query_get_rest_time(deps, _env)?),
        QueryMsg::GetTotalTokens {} => to_json_binary(&query_get_total_tokens(deps, _env)?),
        QueryMsg::GetEndDate {} => to_json_binary(&query_get_end_date(deps, _env)?),
        QueryMsg::GetTokenPrice {} => to_json_binary(&query_get_token_price(deps, _env)?),
        QueryMsg::GetSoldTokenAmount {} => {
            to_json_binary(&query_get_sold_token_amount(deps, _env)?)
        }
        QueryMsg::GetAdminAdress {} => to_json_binary(&query_get_admin_address(deps, _env)?),
        QueryMsg::GetNthStartTime { order } => {
            to_json_binary(&query_get_nth_start_time(deps, _env, order)?)
        }
        QueryMsg::GetNthEndTime { order } => {
            to_json_binary(&query_get_nth_end_time(deps, _env, order)?)
        },
        QueryMsg::GetNthClaimStartTime { order } => {
            to_json_binary(&query_get_nth_claim_start_time(deps, _env, order)?)
        },
        QueryMsg::GetNthClaimEndTime { order } => {
            to_json_binary(&query_get_nth_claim_end_time(deps, _env, order)?)
        },
        QueryMsg::GetUsdtDenom {} => to_json_binary(&query_get_usdt_denom(deps, _env)?),
        QueryMsg::GetSeiDenom {} => to_json_binary(&query_get_sei_denom(deps, _env)?),
        QueryMsg::GetCurrentClaimPhase {} => to_json_binary(&query_get_current_claim_phase(deps, _env)?),
    }
}

fn query_get_sold_token_amount(deps: Deps<SeiQueryWrapper>, _env: Env) -> StdResult<u128> {
    let active_phase = get_active_phase(deps, _env.clone())?;
    if let Some(phase) = active_phase {
        Ok(phase.sold_token_amount / 1000000)
    } else {
        Ok(0)
    }
}

fn query_get_admin_address(deps: Deps<SeiQueryWrapper>, _env: Env) -> StdResult<Addr> {
    let presale_info = PRESALEINFO.may_load(deps.storage)?.unwrap();
    Ok(presale_info.admin_address)
}

fn query_get_usdt_denom(deps: Deps<SeiQueryWrapper>, _env: Env) -> StdResult<String> {
    let presale_info = PRESALEINFO.may_load(deps.storage)?.unwrap();
    Ok(presale_info.usdt_denom)
}

fn query_get_sei_denom(deps: Deps<SeiQueryWrapper>, _env: Env) -> StdResult<String> {
    let presale_info = PRESALEINFO.may_load(deps.storage)?.unwrap();
    Ok(presale_info.sei_denom)
}

fn query_get_nth_start_time(
    deps: Deps<SeiQueryWrapper>,
    _env: Env,
    order: usize,
) -> StdResult<u64> {
    let presale_info = PRESALEINFO.may_load(deps.storage)?.unwrap();
    if presale_info.phases.len() >= order && order > 0 {
        Ok(presale_info.phases[order - 1].start_time)
    } else {
        Ok(9999)
    }
}

fn query_get_nth_end_time(deps: Deps<SeiQueryWrapper>, _env: Env, order: usize) -> StdResult<u64> {
    let presale_info = PRESALEINFO.may_load(deps.storage)?.unwrap();
    if presale_info.phases.len() >= order && order > 0 {
        Ok(presale_info.phases[order - 1].end_time)
    } else {
        Ok(9999)
    }
}

fn query_get_nth_claim_start_time(
    deps: Deps<SeiQueryWrapper>,
    _env: Env,
    order: usize,
) -> StdResult<u64> {
    let presale_info = PRESALEINFO.may_load(deps.storage)?.unwrap();
    if presale_info.phases.len() >= order && order > 0 {
        Ok(presale_info.phases[order - 1].claim_start_time)
    } else {
        Ok(9999)
    }
}

fn query_get_nth_claim_end_time(deps: Deps<SeiQueryWrapper>, _env: Env, order: usize) -> StdResult<u64> {
    let presale_info = PRESALEINFO.may_load(deps.storage)?.unwrap();
    if presale_info.phases.len() >= order && order > 0 {
        Ok(presale_info.phases[order - 1].claim_end_time)
    } else {
        Ok(9999)
    }
}


fn query_get_token_price(deps: Deps<SeiQueryWrapper>, _env: Env) -> StdResult<u128> {
    let active_phase = get_active_phase(deps, _env.clone())?;
    if let Some(phase) = active_phase {
        Ok(phase.price_per_token)
    } else {
        Ok(0)
    }
}

fn query_get_end_date(deps: Deps<SeiQueryWrapper>, _env: Env) -> StdResult<u64> {
    let active_phase = get_active_phase(deps, _env.clone())?;
    if let Some(phase) = active_phase {
        Ok(phase.end_time)
    } else {
        Ok(0)
    }
}

fn query_get_total_tokens(deps: Deps<SeiQueryWrapper>, _env: Env) -> StdResult<u128> {
    let active_phase = get_active_phase(deps, _env.clone())?;
    if let Some(phase) = active_phase {
        Ok(phase.max_tokens / 1000000)
    } else {
        Ok(0)
    }
}

fn query_get_rest_time(deps: Deps<SeiQueryWrapper>, _env: Env) -> StdResult<u64> {
    let active_phase = get_active_phase(deps, _env.clone())?;
    let current_time = _env.block.time.seconds();
    if let Some(phase) = active_phase {
        Ok(phase.end_time - current_time)
    } else {
        Ok(0)
    }
}

// Helper function to determine the current active presale phase
fn query_get_current_phase(deps: Deps<SeiQueryWrapper>, env: Env) -> StdResult<u64> {
    let state = PRESALEINFO.load(deps.storage)?;
    let current_time = env.block.time.seconds();
    let mut count: u64 = 0;

    if current_time < state.phases[0].start_time {
        return Ok(count);
    }
    for phase in state.phases {
        count += 1;
        if current_time >= phase.start_time && current_time <= phase.end_time {
            return Ok(count);
        }
    }
    Ok(count+1) // No active phase
}

// Helper function to determine the current active presale phase
fn query_get_current_claim_phase(deps: Deps<SeiQueryWrapper>, env: Env) -> StdResult<u64> {
    let state = PRESALEINFO.load(deps.storage)?;
    let current_time = env.block.time.seconds();
    let mut count: u64 = 0;

    for phase in state.phases {
        count += 1;
        if current_time >= phase.claim_start_time && current_time <= phase.claim_end_time {
            return Ok(count);
        }
    }
    Ok(count+1) // No active phase
}

fn query_get_rest_token_amount(deps: Deps<SeiQueryWrapper>, _env: Env) -> StdResult<u128> {
    let active_phase = get_active_phase(deps, _env)?;
    if let Some(phase) = active_phase {
        Ok((phase.max_tokens - phase.sold_token_amount) / 1000000)
    } else {
        Ok(0)
    }
}

fn query_get_usei_price(deps: Deps<SeiQueryWrapper>) -> StdResult<ExchangeRatesResponse> {
    // get usei price
    let querier = SeiQuerier::new(&deps.querier);
    let res: ExchangeRatesResponse = querier.query_exchange_rates()?;

    Ok(res)
}

fn query_get_user_token_amount(
    _deps: Deps<SeiQueryWrapper>,
    _env: Env,
    account: Addr,
) -> StdResult<u128> {
    let user = USERS.load(_deps.storage, account).unwrap();
    if user.len() == 3 {
        Ok((user[0] + user[1] + user[2])/1000000)
    }
    else {
        Ok(0)
    }
}

fn query_get_sei_value(_deps: Deps<SeiQueryWrapper>) -> StdResult<Decimal> {
    let res = query_get_usei_price(_deps);
    let value = res.unwrap();

    let decimal = value.denom_oracle_exchange_rate_pairs[4]
        .oracle_exchange_rate
        .exchange_rate;

    Ok(decimal)
}

/* In case you want to upgrade this contract you can find information about
how to migrate the contract in the following link:
https://docs.terra.money/docs/develop/dapp/quick-start/contract-migration.html*/
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn migrate(
    _deps: DepsMut<SeiQueryWrapper>,
    _env: Env,
    _msg: MigrateMsg,
) -> StdResult<Response> {
    Ok(Response::default())
}
