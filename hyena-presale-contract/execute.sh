
    echo "======= get_token_exist_info =============== "

    CONTRACT_ADDR="sei1q0cg0vvqu785xgg6nqn7gqa7karetsj4pkhmu9hmzh7ulwpv409sa30u7g"
    QYERT_EXEC='{
        "import_token": {"token": "sei1qt8llkpe7ugqjnue2ddffah5wfyye8v73etvl75z7aekxxvy7adq67n6le"}
    }'
    CHAIN_ID=atlantic-2
    RPC_URL=https://rpc.atlantic-2.seinetwork.io/

    seid tx wasm execute $CONTRACT_ADDR '{"claim": {}}' --chain-id $CHAIN_ID --from mykey --fees 300000usei --gas=5000000 --keyring-backend=test  --node $RPC_URL -y

    echo "============= End ==========="
