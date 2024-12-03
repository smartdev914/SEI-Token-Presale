    echo "======================= instantiate =========================="

    CODE_ID=8044
    RPC_URL="https://rpc.atlantic-2.seinetwork.io/"
    ADMIN_ADDR="sei149k8zlrdmkpyqdja50652e06y0kza7a7w3gnax"
    CHAIN_ID="atlantic-2"
    LABEL="my_first_instantiate"

    seid tx wasm instantiate $CODE_ID '{
    "admin_address": "sei1xwqxc8nqq3tgxwpacmvraajkxas2vgqacwag0a",
    "token_mint_address": "sei1unnl0dvn28yk8zjyhlfdhp2sksqc8y28s3jc97twcvyud22hqk0q7uvg9d",
    "softcap_amount": "600",
    "hardcap_amount": "800",
    "total_earned_usdt": "0",
    "total_earned_sei": "0",
    "usdt_denom": "ibc/6C00E4AA0CC7618370F81F7378638AE6C48EFF8C9203CE1C2357012B440EBDB7",
    "sei_denom": "usei",
    "phases": [
        {
            "price_per_token": "20",
            "start_time": 1713839200,
            "end_time": 1713840200,
            "claim_start_time": 1713842500,
            "claim_end_time": 1713843500,
            "max_tokens": "400000000000000",
            "sold_token_amount": "0"
        },
        {
            "price_per_token": "24",
            "start_time": 1713840201,
            "end_time": 1713841200,
            "claim_start_time": 1713843501,
            "claim_end_time": 1713844500,
            "max_tokens": "250000000000000",
            "sold_token_amount": "0"
        },
        {
            "price_per_token": "27",
            "start_time": 1713841201,
            "end_time": 1713842200,
            "claim_start_time": 1713844501,
            "claim_end_time": 1713845500,
            "max_tokens": "250000000000000",
            "sold_token_amount": "0"
        }
    ]
}' --from mykey --admin $ADMIN_ADDR --label $LABEL --chain-id $CHAIN_ID --node $RPC_URL  --broadcast-mode block --gas 5000000 --fees 200000usei  --keyring-backend=test -y

echo "======================= END =========================="