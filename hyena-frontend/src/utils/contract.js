import { useSigningCosmWasmClient, useWallet } from "@sei-js/react";
import { useContext } from "react";
import Axios from "axios"
import { setupCache } from "axios-cache-adapter"
import { useCallback } from "react";

import { UserContext } from "../hook/presaleContext";
import { seiDenom} from "./constance";

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const until = Date.now() + 1000 * 60 * 60;
const untilInterval = Date.now() + 1000 * 60;

const cache = setupCache({
    maxAge: 2500,
    clearOnStale: true,
    clearOnError: true,
    readHeaders: true,
    exclude: {
      query: false,
      methods: ["post", "patch", "put", "delete"],
    },
  })

  
const axios = Axios.create({
    adapter: cache.adapter,
})

const useContract = () => {
    const { account, balance } = useContext(UserContext);
    const { connectedWallet, accounts } = useWallet();
    const { signingCosmWasmClient: signingClient } = useSigningCosmWasmClient();
    
    const queryContract = async (contractAddress, queryMsg) => {
        try {
            const query_msg = JSON.stringify(queryMsg);
            const url = `${process.env.REACT_APP_REST_URL}/cosmwasm/wasm/v1/contract/${contractAddress}/smart/${btoa(query_msg)}`;
            const res = (await axios.get(url)).data
            return res.data;
        } catch (e) {
            return null;
        }
        
    }
    
    const executeContract = async (signingClient, contractAddress, senderAddress, executeMsg, funds) => {
        const fee = {
            amount: [{ amount: '0.1', denom: 'usei' }],
            gas: '1000000'
        };
        let txHash = "";
        console.log("msg: ", executeMsg);
        console.log("funds: ", funds);
        try {
            const result = await signingClient?.execute(senderAddress, contractAddress, executeMsg, fee, undefined, funds);
            txHash = result?.transactionHash ?? ""
        } catch (e) {
            console.log(e);
            return false;
        }

        if (!txHash) {
            return false
        }

        while (true) {
            try {
                const { data: res } = await axios.get(
                    `${process.env.REACT_APP_REST_URL}/cosmos/tx/v1beta1/txs/${txHash}`,
                    {
                        cache: { ignoreCache: true },
                    }
                )
                if (res?.tx_response.code) {
                    return false;
                }
        
                if (res?.tx_response.txhash) {
                    return true;
                }
                throw new Error("Unknown")
            } catch (e) {
            if (Date.now() < untilInterval) {
                await sleep(500);
            } else if (Date.now() < until) {
                await sleep(1000 * 10);
            } else {
                throw new Error(
                `Transaction queued. To verify the status, please check the transaction hash: ${txHash}`
                );
            }
            }
        }
    }
    
    const executeBuyToken = useCallback(
        async (token_amount, payAmount, denom) => {
            let fundsAmount = 0;
            if (denom === seiDenom && parseFloat(payAmount*1.2) < parseFloat(balance)) {
                payAmount = payAmount * 1.2;
            }

            fundsAmount = parseFloat(Number(payAmount) * 10 ** 6).toFixed(0);

            let funds = [{
                denom: denom,
                amount: fundsAmount,
            }];
            if ( connectedWallet ) {
                let msg = {
                    buy_token:{"token_amount": (Math.round(token_amount * 10 ** 6)).toString()}
                }
                let response = await executeContract(signingClient, CONTRACT_ADDRESS, account, 
                    msg, funds);
                return response;
            } else {
                return false;
            }
        },
        [signingClient,connectedWallet, account, balance]
    );

    const executeClaimToken = useCallback(
        async () => {
            if ( connectedWallet ) {
                let msg = {
                    claim_token:{}
                }
                let response = await executeContract(signingClient, CONTRACT_ADDRESS, account, msg);
                return response;
            } else {
                return false;
            }
        },
        [signingClient,connectedWallet,account]
    );

    const queryTokenPrice = useCallback (
        async () => {
                let response = await queryContract(CONTRACT_ADDRESS,{get_token_price: { }});
                return response ? response : "0";
        },
        []
    );
    
    const queryRestTime = useCallback (
        async () => {
            let response = await queryContract(CONTRACT_ADDRESS,{get_rest_time: { }});
            return response ? response : "0";

        },
        []
    );
    
    const queryFirstStartTime = useCallback (
        async () => {
            let response = await queryContract(CONTRACT_ADDRESS,{get_nth_start_time: { "order": 1 }});
            return response ? response : "0";

        },
        []
    );
    
    const queryLastEndTime = useCallback (
        async () => {
            let response = await queryContract(CONTRACT_ADDRESS,{get_nth_end_time: { "order": 3 }});
            return response ? response : "0";

        },
        []
    );

    
    const queryTotalTokens = useCallback (
        async () => {
                let response = await queryContract(CONTRACT_ADDRESS,{get_total_tokens: { }});
                return response ? response : "0";
        },
        []
    );

    const queryUserTokenAmount = useCallback (
        async () => {
            if(connectedWallet){
                let response = await queryContract(CONTRACT_ADDRESS,{get_user_token_amount: {account: accounts[0].address }});
                return response ? response : "0";
            }
        },
        [connectedWallet, accounts]
    );

    const queryRestTokenAmount = useCallback (
        async () => {
                let response = await queryContract(CONTRACT_ADDRESS, { get_rest_token_amount: {} });
                return response ? response : "0";
        },
        []
    );

    const queryCurrentPhase = useCallback (
        async () => {
                let response = await queryContract(CONTRACT_ADDRESS, { get_current_phase: { } });
                return response ? response : "0";
        },
        []
    );
    
    const queryCurrentClaimPhase = useCallback (
        async () => {
                let response = await queryContract(CONTRACT_ADDRESS, { get_current_claim_phase: { } });
                return response ? response : "0";
        },
        []
    );

    const queryEndDate = useCallback (
        async () => {
                let response = await queryContract(CONTRACT_ADDRESS, { get_end_date: {} });
                return response ? response : "0";
        },
        []
    );
    
    const querySeiValue = useCallback (
        async () => {
                let response = await queryContract(CONTRACT_ADDRESS, { get_sei_value: {} });
                return response ? response : "0";
        },
        []
    );
    return {
        queryUserTokenAmount,
        // queryPresaleTime,
        queryEndDate,
        queryTotalTokens,
        querySeiValue,
        queryRestTokenAmount,
        queryRestTime,
        queryCurrentPhase,
        queryCurrentClaimPhase,
        executeBuyToken,
        executeClaimToken,
        queryTokenPrice,
        queryFirstStartTime,
        queryLastEndTime,
    }
}

export default useContract;