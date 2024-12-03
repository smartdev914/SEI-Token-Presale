import React, { createContext, useState } from 'react';

// Create and export MyContext
export const UserContext = createContext({
  value: '',
  setValue: () => {}
});

export function UserProvider({ children }) {
  
  const initDate = {
    day: "00",
    month: "00",
    year: "00",
  }

  const [seiValue, setSeiValue] = useState(0);
  const [tokenPrice, setTokenPrice] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [account, setAccount] = useState();
  const [totalTokens, setTotalTokens] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [endDate, setEndDate] = useState(initDate);
  const [restTokens, setRestTokens] = useState(0);
  const [balance, setBalance] = useState(0);
  const [usdtBalance, setUsdtBalance] = useState(0);
  const [firstStartTime, setFirstStartTime] = useState(initDate);
  const [lastEndTime, setLastEndTime] = useState(initDate);
  const [currentClaimPhase, setCurrentClaimPhase] = useState(0);

    const contextValue = { account, totalTokens, currentPhase, endDate, restTokens, restTime, tokenPrice,  seiValue, balance, usdtBalance, firstStartTime, currentClaimPhase, setCurrentClaimPhase, setFirstStartTime, lastEndTime, setLastEndTime, setUsdtBalance, setBalance, setSeiValue, setTokenPrice, setRestTime, setAccount, setTotalTokens, setCurrentPhase, setEndDate, setRestTokens };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}
