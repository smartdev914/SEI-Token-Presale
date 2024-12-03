
    echo "================================================="
    echo "Rust Optimize Build Start"
    
    rm -rf target
    
    # cd contracts
    
    # cd $CATEGORY
    RUSTFLAGS='-C link-arg=-s' cargo build --release --target wasm32-unknown-unknown

    # cd ../../

    # cp target/wasm32-unknown-unknown/release/$CATEGORY.wasm release/