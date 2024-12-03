import { useEffect, useRef, useState, useContext } from "react";
import { useQueryClient, useWallet } from "@sei-js/react";
import {toast} from "react-toastify"
import { formatNumber } from "../utils/utils";

import { UserContext } from "../hook/presaleContext";
import PriceCard from "../component/presale/priceCard";
import Switch from "../asset/svg/switch.svg"
import useContract from "../utils/contract";
import Spinner from "../utils/spinner";
import {getTimeComponentsFromTimestamp, initTime, convertTimestampToDetailedDate, getMonthName} from "../utils/utils"
import SmallRect from "../component/landing/smallRect";
import { seiDenom, usdtDenom, roundNum } from "../utils/constance";

import Hyena from "../asset/img/hyena.png"
import Discord from "../asset/svg/discord.svg"
import Telegram from "../asset/svg/telegram.svg"
import Youtube from "../asset/svg/youtube.svg"
import FaceBook from "../asset/svg/facebook.svg"
import "./pages.css"
import TokenModal from "../component/modal/tokenModal";

import SEI from "../asset/img/sei.png"
import USDT from "../asset/svg/usdt.svg"
import Down from "../asset/svg/down.svg"


const Presale = () => {
  const { totalTokens, currentPhase, restTokens, restTime, setRestTime, account, tokenPrice, balance, usdtBalance, firstStartTime, currentClaimPhase, setCurrentClaimPhase, setFirstStartTime, setLastEndTime, setUsdtBalance, setBalance, seiValue, setSeiValue, setTokenPrice, setTotalTokens, setCurrentPhase, setRestTokens} = useContext(UserContext);
  const {queryUserTokenAmount, queryRestTokenAmount, queryTokenPrice, querySeiValue, queryRestTime, executeBuyToken, executeClaimToken, queryCurrentPhase, queryTotalTokens, queryFirstStartTime, queryLastEndTime, queryCurrentClaimPhase} = useContract();
  const {connectedWallet} = useWallet();
  const { queryClient } = useQueryClient();

  const receiveInputValue = useRef();
  const inputValue = useRef();

  const [userTokenAmount, setUserTokenAmount] = useState(0);
  const [state, setState] = useState(0);
  const [inputState, setInputState] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  let gasFee = 0.02;
  let denom = [seiDenom, usdtDenom];
  const [showRestTime, setShowRestTime] = useState(initTime);
  //set value when token kind(sei or usdt) is changed
  useEffect(() => {
    
    if(inputState === 0){
      if(state === 0) {
        receiveInputValue.current.value = tokenPrice? (inputValue.current.value / tokenPrice * seiValue ).toFixed(6): 0;
      }
      else {
        receiveInputValue.current.value = tokenPrice? (inputValue.current.value / tokenPrice).toFixed(6): 0;
      }
    } 
    else {
      if(state === 0) {
        inputValue.current.value = seiValue? (receiveInputValue.current.value * tokenPrice / seiValue ).toFixed(6): 0;
      }
      else {
        inputValue.current.value = seiValue? (receiveInputValue.current.value * tokenPrice).toFixed(6): 0;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])
  //refresh if you buy Hyena
  useEffect(() => {
    buyFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedWallet, balance]);
  //refresh page every 60 seconds
  useEffect(() => {
    //data refresh when you load page first
    const initFetch = async () => {
  
      const currentPhase = await queryCurrentPhase();
      if (currentPhase) {
        setCurrentPhase(currentPhase);
      }
      
      const currentClaimPhase = await queryCurrentClaimPhase();
      if (currentClaimPhase) {
        setCurrentClaimPhase(currentClaimPhase);
      }
      
      const totalTokensAmount = await queryTotalTokens();
      if (totalTokensAmount) {
        setTotalTokens(totalTokensAmount);
      }
  
      const userTokenAmountResult = await queryUserTokenAmount();
      if (userTokenAmountResult) {
        setUserTokenAmount(userTokenAmountResult);
      }
  
      if(connectedWallet) {
        try {
          if(connectedWallet || account){
            const balanced = await getWalletBalance(connectedWallet, queryClient, account);
            if (balanced || account) {
              setBalance(Number(balanced.balances[0].amount) / 10 ** 6);
            } else {
              setBalance(10);
            }
          } 
        }catch (e) {
          console.log(e);
        }
      }
      
      const restTokenAmountResult = await queryRestTokenAmount();
      if (restTokenAmountResult) {
        setRestTokens(restTokenAmountResult);
      }
      
      const restTimeResult = await queryRestTime();
      if (restTimeResult) {
        setRestTime(restTimeResult);
      }
      
      const tokenPrice = await queryTokenPrice();
      if (tokenPrice) {
        setTokenPrice(parseFloat(tokenPrice)/100);
      }
      const seiValueResult = await querySeiValue();
      if (restTokenAmountResult) {
        setSeiValue(seiValueResult);
      }
      
      const fsTime = await queryFirstStartTime();
      const fsFormatTime = convertTimestampToDetailedDate(fsTime);
      if (fsFormatTime) {
        setFirstStartTime(fsFormatTime);
      }
      
      const leTime = await queryLastEndTime();
      const leFormatTime = convertTimestampToDetailedDate(leTime);
      if (leFormatTime) {
        setLastEndTime(leFormatTime);
      }
    }
    initFetch();
    let count = -1;
    count = setInterval(()=>refreshFetch(), 60000);
    return () => clearInterval(count);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //count rest time
  useEffect(() => {
    if(restTime > 0) {
      let intV = -1;
      let ctimer = restTime;
      dateFormat(ctimer);
       intV = setInterval(()=>dateFormat(ctimer = ctimer-1), 1000);
      return () => clearInterval(intV);
    }

  }, [restTime])

  const dateFormat = (count) => {
    if(count <= 0) {
      count = 0;
    }
    const formatTime = getTimeComponentsFromTimestamp(count);
    setShowRestTime(formatTime);
}

  //set value if you click Max button
  const setMax = () => {
    if(!connectedWallet) {
      toast.error("Please connect wallet");
      return;
    }
    if(parseFloat(balance) < parseFloat(gasFee)) {
      toast.warning("Your SEI is not enough to send transaction")
      return;
    }
    if(state === 0){
      inputValue.current.value = balance>gasFee? balance-gasFee: 0;
      receiveInputValue.current.value = tokenPrice? ((inputValue.current.value - gasFee) / tokenPrice * seiValue ).toFixed(6): 0;
    }
    else{
      inputValue.current.value = usdtBalance;
      receiveInputValue.current.value = tokenPrice? (inputValue.current.value / tokenPrice).toFixed(6): 0;
    }
  }
  //set token number when you input payment value
  const setToken = () => {
    setInputState(0);
    if(state === 0){
      receiveInputValue.current.value = tokenPrice? (inputValue.current.value / tokenPrice * seiValue ).toFixed(6): 0;
    }
    else{
      receiveInputValue.current.value = tokenPrice? (inputValue.current.value / tokenPrice).toFixed(6): 0;
    }
  }
  //set payment when you input token number
  const setPayment = () => {
    setInputState(1);
    if(state === 0){
      inputValue.current.value = seiValue? (receiveInputValue.current.value * tokenPrice / seiValue ).toFixed(6): 0;
    }
    else{
      inputValue.current.value = seiValue? (receiveInputValue.current.value * tokenPrice).toFixed(6): 0;
    }
  }
  //data refresh after you buy token
  const buyFetch = async () => {

    const userTokenAmountResult = await queryUserTokenAmount();
    if (userTokenAmountResult) {
      setUserTokenAmount(userTokenAmountResult);
    }

    if(connectedWallet) {
      try {
        if(connectedWallet || account){
          const balanced = await getWalletBalance(connectedWallet, queryClient, account);
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
      }catch (e) {
        console.log(e);
      }
    }
    
    const restTokenAmountResult = await queryRestTokenAmount();
    if (restTokenAmountResult) {
      setRestTokens(restTokenAmountResult);
    }
    
  }
  
  //data refresh when you load page first
  const refreshFetch = async () => {

    const currentPhase = await queryCurrentPhase();
    if (currentPhase) {
      setCurrentPhase(currentPhase);
    }

    if(connectedWallet) {
      try {
        if(connectedWallet || account){
          const balanced = await getWalletBalance(connectedWallet, queryClient, account);
          if (balanced || account) {
            setBalance(Number(balanced.balances[0].amount) / 10 ** 6);
          } else {
            setBalance(10);
          }
        } 
      }catch (e) {
        console.log(e);
      }
    }
    
    const restTokenAmountResult = await queryRestTokenAmount();
    if (restTokenAmountResult) {
      setRestTokens(restTokenAmountResult);
    }
    
    const restTimeResult = await queryRestTime();
    if (restTimeResult) {
      setRestTime(restTimeResult);
    }
    
    const seiValueResult = await querySeiValue();
    if (restTokenAmountResult) {
      setSeiValue(seiValueResult);
    }
  }
  
const getWalletBalance = async (connectedWallet, client, address) => {

  if (connectedWallet) {
    const balances = await client?.cosmos.bank.v1beta1.allBalances({address});
    return balances;
  } else {
    return 0;
  }
}
  //buy token
  const buy_token = async () => {
    const tokenAmount = receiveInputValue.current.value;
    const payAmount = inputValue.current.value;
    if(!connectedWallet){
      toast.warning("Please connect wallet!");
      return;
    }
    if(parseFloat(balance) < gasFee) {
      toast.warning("You haven't enough SEI for gas. Please buy SEI");
      return;
    }
    if ((denom[state] === "usdt")) {
      if(parseFloat(payAmount) > parseFloat(usdtBalance)){
        toast.warning("Your USDT is not enough. Please buy more USDT!");
        return;
      }
    }
    if(denom[state] === "usei" && parseFloat(payAmount) > balance ) {
      toast.warning("Inssuficient SEI token! Please buy more SEI!");
      return;
    }
    if (parseFloat(tokenAmount) <= 0.0) {
      toast.warning("Please enter valid Hyena amount");
      return;
    }
    if( parseFloat(tokenAmount) > parseFloat(restTokens)){
      toast.warning(`You ask much more Hyena. The limitation is ${restTokens}!`);
      return;
    }
    if(loading){
      toast.warning("Please wait! Pending...");
      return;
    }
    let result = 0;
    try {
      setLoading(true);
     result = await executeBuyToken(tokenAmount, payAmount, denom[state]);
     if (result === false){
      setLoading(false);
      toast.error("Transaction failed");
     }
     else {
      setLoading(false);
      toast.success("You bought Hyena successfully");
      try {
        if(connectedWallet || account){
          const balanced = await getWalletBalance(connectedWallet, queryClient, account);
          if (balanced || account) {
            setBalance(Number(balanced.balances[0].amount) / 10 ** 6);
            buyFetch();
          } else {
            setBalance(10);
          }
        } 
      }catch (e) {
        console.log(e);
      }
      
     }
    } catch (e) {
      console.log("catch", e);
      toast.error("Transaction failed");
    }
  }
  //claim token
  const claim_token = async() => {
    let result = 0;

    if(!connectedWallet) {
      toast.error("Please connect wallet");
      return;
    }
    try {
      setLoading(true);
     result = await executeClaimToken();
     if(result === true){
      setLoading(false);
      toast.success("You claimed Hyena successfully!");
      buyFetch();
      return;
     }
     else {
      setLoading(false);
        toast.error("Transaction failed!")
        return;
     }
    } catch (e) {
      console.log(e);
      toast.error("Transaction failed!")
      return;
    }
  }
  
  const handleButton = () => {
    if (currentPhase === 0) {
      toast.warning("Please wait for presale");
    }
    else if (currentPhase > 0 && currentPhase <= roundNum) {
      buy_token();
    }
    else if (currentClaimPhase < roundNum+1)  {
      claim_token();
    }
    else {
      toast.warning("You can't buy or claim now");
    }
  }

  return (
    <div className={`${loading && "cursor-progress"}`}>
        <div className="flex flex-col bg-[#15161F] justify-center items-center pr-16 pl-16 pb-8 pt-8 relative sm:px-2 sm:pt-8 ">
            <div className="flex w-full justify-between py-8 px-24 gap-[94px] sm:gap-[12px] sm:p-0  sm:w-full sm:mt-4 sm:mb-4 sm:flex-col">
                <PriceCard price={"$"+formatNumber(parseFloat(tokenPrice))} state={"(" + formatNumber(seiValue * tokenPrice) + " SEI)"} description="Hyena Price"></PriceCard>
                <PriceCard price={"$"+ (tokenPrice? formatNumber((totalTokens - restTokens) * tokenPrice): 0)} state={"(" + formatNumber((totalTokens - restTokens) * tokenPrice / seiValue) + " SEI)"} description="Total Raised"></PriceCard>
                <PriceCard price={(formatNumber(totalTokens - restTokens)) + " Hyena"} state={"("+ formatNumber(totalTokens > 0?((totalTokens - restTokens)/totalTokens*100): 0) + "%)"} description="Total Sold"></PriceCard>
                <PriceCard price={formatNumber(parseFloat(userTokenAmount)) + " Hyena"} state={"(" + (totalTokens > 0? formatNumber(userTokenAmount/totalTokens*100): 0) + "%)"} description="My Allocation"></PriceCard>
            </div>
            <div className="flex flex-col w-[853px] py-8 justify-center items-center gap-y-2 text-white sm:w-full">
                <div className="flex bg-[#222222] flex-col w-full justify-between p-2 rounded-[10px] mb-[20px]">
                    <span className="text-[55.23px] leading-32 font-bold sm:text-[8px] animate-pulse">PRESALE {currentPhase === 0? "START": currentPhase <= roundNum? currentPhase: "END"}</span>
                      <div className="text-[36.82px] sm:text-[20px] flex justify-center items-center gap-[10px] ">
                        {
                          currentPhase === 0 ? 
                            <span className="text-[40px] leading-32 font-bold sm:text-[20px]">Presale will be started in {firstStartTime.day} {getMonthName(firstStartTime.month)} {firstStartTime.year}</span>:
                          currentPhase <= roundNum? 
                          <>
                            <SmallRect value={showRestTime.days} type="Days"></SmallRect>
                            <span className="text-[64px] pb-[12px]  animation-pulse">:</span>
                            <SmallRect value={showRestTime.hours} type="Hours"></SmallRect>
                            <span className="text-[64px] pb-[12px] ">:</span>
                            <SmallRect value={showRestTime.minutes} type="Munites"></SmallRect>
                            <span className="text-[64px] pb-[12px]">:</span>
                            <SmallRect value={showRestTime.seconds} type="Seconds"></SmallRect>
                          </>:
                          <span className="text-[40px] leading-32 font-bold sm:text-[20px]">The Last Round is ended!</span>
                        }
                      </div>
                    <span className="text-[27.62px] leading-32 font-normal mb-[20px] sm:mb-[0px] sm:text-[16px]">You can still buy! Let's go to the moon with Hyena now!</span>
                </div>
                <div className="flex flex-col p-32 bg-[#EEEEEE1A] rounded-[15.34px] w-full p-[60px] sm:p-[24px]">
                    <div className="flex flex-col items-start">
                        <span  className=" text-[27.62px] font-normal leading-6 mb-[16px] sm:text-[18px]">You pay</span>
                        <div className="bg-[#EEEEEE1A] w-full flex justify-between p-0.5 items-center sm:p-0.5 rounded-[10px]">
                            <input className="text-[32px] font-normal leading-6 bg-transparent outline-0 w-[80%] sm:text-[20px] px-2" ref={inputValue} onChange={setToken} type="number" placeholder="0"></input>
                            <div className="text-white bg-[#EEEEEE1A]  rounded-lg text-sm px-1 py-1 text-left inline-flex items-center dark:bg-[#EEEEEE1A] cursor-pointer relative w-[200px] sm:w-[160px] flex justify-left" id="dropdownDefaultButton " onClick={openModal}>
                        <div className=" w-full group ">
                          <button className=" peer flex justify-between items-center w-full">
                            <div  disabled={loading} className="flex items-center ">
                              <img src={state === 0? SEI: USDT} alt="pls" className="w-[53.7px] h-[53.7px] sm:h-[36px] sm:w-[36px] p-1"></img>
                              <div className="text-[32px] font-normal leading-6 sm:text-[20px] ml-[5px] grow">{state === 0? "SEI": "USDT"}</div>
                            </div>
                            <img src={Down} alt="narrow" className="sm:w-[24px] ml-[5px] pr-[10px]"></img>
                          </button>
                        </div>
                            </div>
                        </div>
                        <TokenModal isOpen={isModalOpen} onClose={closeModal} setCoin={setState}></TokenModal>
                        <div className="flex gap-[4px] p-2">
                            <span className="text-[21.48px] font-normal leading-4 sm:text-[18px]">Balance: {state === 0 ? balance: usdtBalance}</span>
                            <span className="text-[21.48px] font-normal leading-4 text-[#A17948] cursor-pointer sm:text-[18px]" onClick={setMax}>Max</span>
                        </div>
                        <div className="flex w-full justify-center items-center ">
                            <img src={Switch} alt="switch" className="sm:w-[34px] animate-bounce"></img>
                        </div>
                        <span  className=" text-[27.62px] font-normal leading-6 mb-[16px] sm:text-[18px]">You receive</span>
                        <div className="bg-[#EEEEEE1A] w-full flex justify-between p-0.5 items-center sm:p-0.5 rounded-[10px]">
                            <input className="text-[36.82px] font-normal leading-6 bg-transparent outline-0 w-[80%] 
                            sm:text-[20px] px-2" id="pay-coin" placeholder="0" type="number" step="0" onChange={setPayment}    ref={receiveInputValue}></input>
   
                            <div className="text-white bg-[#EEEEEE1A]  rounded-lg text-sm px-1 py-1 text-center inline-flex items-center cursor-pointer relative w-[200px] sm:w-[160px]">
                            <div className=" w-full group">
                              <button className=" peer flex  items-center">
                                <img src={Hyena} alt="pls" className="w-[53.7px] h-[53.7px] sm:w-[36px] sm:h-[36px] p-1"></img>
                                <div className="text-[36.82px] font-normal leading-6 pr-[12px] sm:text-[20px]">Hyena</div>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="flex w-full justify-center items-center">
                            <button  disabled={loading} className= {`w-[240px] sm:w-[60%] h-[64px] sm:h-[48px] rounded-[15.34px] bg-[#A17948] flex items-center justify-center mt-[30px] mb-[10px] relative   ${loading ? "": "cursor-pointer  shadow-lg shadow-orange-500/50"}`}  onClick={handleButton}>
                            {loading ?
                             <Spinner ></Spinner> : <span className="text-[30.68px] leading-5 sm:text-[24px] ">{currentPhase === 0? "Wait":  currentPhase <= roundNum? "Buy": currentClaimPhase <= roundNum? "Claim": "Connect"}</span>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      <div className='flex items-center justify-center p-8 bg-[#1E1F25]'>
        <div className='flex flex-col items-center justify-center gap-y-8'>
          <div className='w-[254px] drop-shadow-[0_4px_70px_rgba(255,255,255,0.1)]'>
            <img  src={Hyena} alt='hyena'></img>
          </div>
          <span className='text-[48px] font-semibold leading-7 text-white  sm:text-[28px]'>Laughing Hyena</span>
          <div className='flex justify-between gap-x-8  sm:gap-2'>
            <img src={Discord} alt='discord'  className='sm:w-[40px]'></img>
            <img src={Telegram} alt='telegram'  className='sm:w-[40px]'></img>
            <img src={Youtube} alt='youtube' className='sm:w-[40px]'></img>
            <img src={FaceBook} alt='facebook' className='sm:w-[40px]'></img>
          </div>
          <span className='text-[24px] font-medium leading-7 text-white sm:text-[16px]'>©2024 Laughing Hyena. All rights reserved</span>
        </div>
      </div>
    </div>
  );
}

export default Presale;
