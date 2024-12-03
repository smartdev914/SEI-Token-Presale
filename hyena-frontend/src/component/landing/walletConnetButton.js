import { useSelectWallet, useWallet, useQueryClient } from "@sei-js/react";
import React, { useContext, useEffect } from "react";
import { UserContext } from "../../hook/presaleContext";
import { getWalletBalance } from "../../utils/utils";
import useContract from "../../utils/contract";
import { seiDenom, usdtDenom } from "../../utils/constance";

const WalletConnectButton = (props) => {
  const { account, setBalance, setUsdtBalance, setAccount, setRestTokens } = useContext(UserContext);
  const { queryRestTokenAmount } = useContract();
  const { connectedWallet, accounts, disconnect } = useWallet();
  const { openModal } = useSelectWallet();
  const { queryClient } = useQueryClient();

  // Handle click on the button
  const onClick = () => {
    if (connectedWallet) {
      disconnect(); // Disconnect if already connected
      setBalance(0);
    } else {
      openModal(); // Open modal to connect wallet if not connected
    }
  };

  // Effect to update account when accounts change
  useEffect(() => {
    if (connectedWallet && accounts.length > 0) {
      setAccount(accounts[0].address); // Set the account address when available
    }
  }, [connectedWallet, accounts, setAccount]); // Depend on connectedWallet and accounts to update

  
  useEffect(() => {
    //get balance of wallet if you connect to wallet
    const fetch = async () => {
  
      const restTokenAmountResult = await queryRestTokenAmount();
      if (restTokenAmountResult) {
        setRestTokens(restTokenAmountResult);
      }
  
      try {
        if (connectedWallet || account) {
          const balanced = await getWalletBalance(connectedWallet, queryClient, accounts[0].address);
          if (balanced && balanced.balances.length > 0) {
            for (let i = 0; i < balanced.balances.length; i ++) {
              if (balanced.balances[i].denom === seiDenom ) {
                setBalance(Number(balanced.balances[i].amount) / 10 ** 6);
              }
              else if (balanced.balances[i].denom === usdtDenom ) {
                setUsdtBalance(Number(balanced.balances[i].amount) / 10 ** 6);
              }
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
  
    }
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedWallet, account, accounts])

  return (
    <button
      className={`w-[200px] sm:w-[160px] h-[56px] text-[20px] bg-[${props.bg}] flex items-center justify-center rounded-[4px] border-[${props.borderWeight}] border-[${props.borderColor}] text-white pl-[5px]  `}
      onClick={onClick}
    >
      <span className="text-ellipsis overflow-hidden">
        {connectedWallet ? account : "CONNECT WALLET"}</span>
    </button>
  );
};


export default WalletConnectButton;
