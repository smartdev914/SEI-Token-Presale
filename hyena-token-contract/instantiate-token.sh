echo "========================  instantiate  ========================="
    
    CODE_ID=8049
    RPC_URL="https://rpc.atlantic-2.seinetwork.io/"
    ADMIN_ADDR="sei1xwqxc8nqq3tgxwpacmvraajkxas2vgqacwag0a"
    CHAIN_ID="atlantic-2"
    LABEL="hyena token"

    seid tx wasm instantiate $CODE_ID '{ "name": "Laughing Hyena", "symbol": "Hyena", "decimals": 6, "initial_balances": [{"address":"sei1xwqxc8nqq3tgxwpacmvraajkxas2vgqacwag0a","amount":"1680000000000000"}]}' --from mykey --admin $ADMIN_ADDR --label $LABEL --chain-id $CHAIN_ID --node $RPC_URL  --broadcast-mode block --gas 5000000 --fees 200000usei  --keyring-backend=test -y

echo "========================  end  ========================="