UPLOAD_DIR="./target/wasm32-unknown-unknown/release/"
UPLOAD_FILE="hyena_presale.wasm"
seid tx wasm store $UPLOAD_DIR$UPLOAD_FILE --from mykey --chain-id=atlantic-2 --node=https://rpc.atlantic-2.seinetwork.io/ --broadcast-mode=block --gas=3000000 --fees=60000usei  --keyring-backend=test -y
# seid tx bank send mykey sei149k8zlrdmkpyqdja50652e06y0kza7a7w3gnax 13300000usei --fees=50000usei --chain-id=atlantic-2 --node=https://rpc.atlantic-2.seinetwork.io/ --broadcast-mode=block --keyring-backend=test -y

