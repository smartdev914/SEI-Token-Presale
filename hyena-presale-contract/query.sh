
    echo "======= get_token_exist_info =============== "
    CONTRACT_ADDR="sei1k7jtlcmkhnq2ah6t98cpxwmgdvg72ejxpg23n33tpy8r2swcqh2scynlke"
    seid query wasm contract-state smart $CONTRACT_ADDR '{ "get_rest_token_amount": {} }' --node https://rpc.atlantic-2.seinetwork.io/ --chain-id atlantic-2

    echo "============= End ==========="