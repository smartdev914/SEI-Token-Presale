
import { useState, useEffect, useContext } from 'react';

import Button from '../component/landing/button';
import Rectangle from '../component/landing/rectangle';
import DoubleDot from '../component/landing/doubleDot';
import ToggleButton from '../component/landing/toggleButton';
import VerticalText from '../component/landing/verticalText';
import VerticalLine from '../component/landing/verticalLine';
import Note from '../component/landing/note';
import WalletConnectButton from '../component/landing/walletConnetButton';
import HorizontalLine from "../component/landing/HorizontalLine";
import HorizontalText from "../component/landing/HorizontalText"
import useContract from '../utils/contract';
import { UserContext } from '../hook/presaleContext';
import { formatFormalNumber, getTimeComponentsFromTimestamp, convertTimestampToDetailedDate, getMonthName} from "../utils/utils"
import { roundNum } from '../utils/constance';

import './pages.css';

import Hyena from "../asset/img/hyena.png"
import Discord from "../asset/svg/discord.svg"
import Telegram from "../asset/svg/telegram.svg"
import Youtube from "../asset/svg/youtube.svg"
import FaceBook from "../asset/svg/facebook.svg"

function Landing() {
  const { totalTokens, currentPhase, endDate, restTokens, restTime, firstStartTime, lastEndTime, setLastEndTime, setFirstStartTime,  setSeiValue, setTokenPrice, setRestTime, setTotalTokens, setCurrentPhase, setEndDate, setRestTokens } = useContext(UserContext);
  const { queryRestTokenAmount, querySeiValue, queryRestTime, queryTotalTokens, queryTokenPrice, queryCurrentPhase, queryEndDate, queryFirstStartTime, queryLastEndTime} = useContract();

  const initTime = {
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00"
  }
  const [showRestTime, setShowRestTime] = useState(initTime);

  const dateFormat = (count) => {

      const formatTime = getTimeComponentsFromTimestamp(count);
      setShowRestTime(formatTime);
  }


  useEffect(() => {
    if(restTime > 0) {
      let intV = -1;
      let ctimer = restTime;
      dateFormat(ctimer);
      intV = setInterval(()=>dateFormat(ctimer = ctimer-1), 1000);
      return () => clearInterval(intV);
    }

  }, [restTime])


  useEffect(() => {
    //initialize from contract
    const fetch = async () => {
      const totalTokensAmount = await queryTotalTokens();
      if (totalTokensAmount) {
        setTotalTokens(totalTokensAmount);
      }
      
      const seiValue = await querySeiValue();
      if (seiValue) {
        setSeiValue(seiValue);
      }
      
      const currentPhase = await queryCurrentPhase();
      if (currentPhase) {
        setCurrentPhase(currentPhase);
      }
      
      const endDate = await queryEndDate();
      const curTime = convertTimestampToDetailedDate(endDate);
      if (curTime) {
        setEndDate(curTime);
      }
        
      const tPrice = await queryTokenPrice();
      if (tPrice) {
        setTokenPrice(parseFloat(tPrice)/100);
      }
        
      const restTokenAmountResult = await queryRestTokenAmount();
      if (restTokenAmountResult) {
        setRestTokens(restTokenAmountResult);
      }
  
      const restTimeResult = await queryRestTime();
      if (restTimeResult) {
        setRestTime(restTimeResult);
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
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  return (
    <div className='relative'>
      <div className="bg-[#15161F] flex justify-center items-center pt-16 pb-12 sm:pb-4 sm:pt-8" id="read" >
        <div className='w-[70%] flex justify-between sm:flex-col-reverse'>
          <div className='flex flex-col w-[935px] sm:w-full'>
            <div className="w-full  flex flex-col items-start gap-y-8 pb-24 sm:pb-8">
              <div className='text-[#A17948] text-[24px] font-semibold font-sans flex content-start'>
                <span>- Laughing Hyena</span>
              </div>
              <div className='text-[96px] leading-[120.96px] 3xl:leading-[64px] font-bold flex justify-start  3xl:text-[64px]'>
                <span className='text-start text-white sm:text-[32px]  sm:leading-[48px]'>Buy Laughing Hyena Now And Receive Airdrop Allocation. </span>
              </div>
              <div className='text-[20px] font-normal leading-[32px] flex content-start'>
                <span className='text-start text-white'>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</span>
              </div>
            </div>
            <div className=' gap-[30px] flex pb-8 '>
              <WalletConnectButton bg="#A17948" >Connect Wallet</WalletConnectButton>
              <Button borderWeight="1px" borderColor="#FFFFFF">Guide  to FAQ</Button>
            </div>
          </div>
          <div className=' min-w-[552px] max-w-[552px] min-h-[652px] max-h-[652px] sm:min-w-[300px] sm:min-h-[300px]  drop-shadow-[0_4px_70px_rgba(255,255,255,0.1)] flex items-center'>
            <img src={Hyena} alt='hyena'></img>
          </div>
        </div>
      </div>
      <div className=' relative bg-[#1E1F25] flex items-center justify-center  pb-16' id="contact">
        <div className='flex flex-col justify-center relative pt-16 gap-y-8 sm:gap-y-2 m-8 sm:m-0 sm:pt-8'>
            <span className='text-[90px] font-bold leading-[135px] text-white p-8 sm:leading-[32px] sm:text-[32px]'>PRESALE - { currentPhase === 0? "START": currentPhase <= roundNum? currentPhase: "END"}</span>
          <div className='flex items-center gap-x-8 sm:gap-x-2 mb-16 sm:mb-2 justify-between'>
            <Rectangle value={showRestTime.days} type="DAYS"></Rectangle>
            <DoubleDot></DoubleDot>
            <Rectangle value={showRestTime.hours} type="HOURS"></Rectangle>
            <DoubleDot></DoubleDot>
            <Rectangle value={showRestTime.minutes} type="MINUTES"></Rectangle>
            <DoubleDot></DoubleDot>
            <Rectangle value={showRestTime.seconds} type="SECONDS"></Rectangle>
          </div>
          <div className='flex flex-col justify-start items-start'>
            <span className='text-2xl content-start text-white sm:text-[18px]'>1 LH = 35MMD</span>
            <div className='border-4 border-solid border-white w-full h-1 px-8'></div>
          </div>
          <div className='flex flex-col justify-start items-start'>
            <span className='text-2xl content-start text-white sm:text-[18px]'>Total Token  for save = {totalTokens > 0?formatFormalNumber(parseFloat(totalTokens)): 0}</span>
          </div>
          <div className='flex flex-col justify-start items-start'>
            {currentPhase === 0? <span className='text-2xl content-start text-white  sm:text-[18px]'>First round will be started in {firstStartTime.day} {getMonthName(firstStartTime.month)} {firstStartTime.year}</span>:
            currentPhase <= roundNum? <span className='text-2xl content-start text-white  sm:text-[18px]'>Phase {currentPhase} End in {endDate.day} {getMonthName(endDate.month)} {endDate.year}</span>:
            <span className='text-2xl content-start text-white  sm:text-[18px]'>Last round has ended in {lastEndTime.day} {getMonthName(lastEndTime.month)} {lastEndTime.year}</span>}
            
          </div>
          <div className='flex flex-col justify-start items-start'>
          <div className="w-full bg-gray-200 rounded-[10px] dark:bg-gray-700">
            <div className="bg-white h-[28px] sm:h-[16px] text-[#FFFFFF] font-medium text-blue-100 text-right p-0.5 leading-none rounded-[10px] text-[18px]" style={{width: (totalTokens - restTokens)/totalTokens*100 + "%"}}><span className='text-[#1E1015]'> </span></div>
          </div>

          </div>
          <div className='flex justify-between items-start'>
            <span className='text-2xl content-start text-white sm:text-[18px]'>{totalTokens > 0? formatFormalNumber(parseFloat(totalTokens - restTokens)): 0}</span>
            <span className='text-2xl content-start text-white sm:text-[18px]'>{totalTokens > 0? formatFormalNumber(parseFloat(totalTokens)): 0}</span>
          </div>
          <ToggleButton>Buy Tokens</ToggleButton>
        </div>
      </div>
      <div className=' relative bg-[#15161F] flex items-center justify-center pt-16 pb-16 overflow-hidden ' id="legal">
        <div className='flex flex-col items-center justify-center relative gap-y-4 p-8 w-[80%]'>
          <div className='w-full h-[3px] bg-gradient-to-b from-[#A17948] to-[#1B70F105]'></div>
          <div className='flex gap-8 sm:gap-2  items-center justify-between w-full sm:flex-col '>
            <HorizontalText >Phase 2</HorizontalText>
            <HorizontalLine></HorizontalLine>
            <VerticalText >Phase 2</VerticalText>
            <VerticalLine></VerticalLine>
            <Note title="250 Million">
              <p>But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful.</p>
              <p>But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness.</p>
            </Note>
          </div>
          <div className='flex gap-8 sm:gap-2  items-center justify-between w-full sm:flex-col'>
            <HorizontalText >Phase 3</HorizontalText>
            <HorizontalLine></HorizontalLine>
            <VerticalText >Phase 3</VerticalText>
            <VerticalLine></VerticalLine>
            <Note title="250 Million">
              <p>But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful.</p>
              <p>But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness.</p>
            </Note>
          </div>
          <div className='flex gap-8 sm:gap-2 items-center justify-between w-full sm:flex-col'>
            <HorizontalText >Air Drop</HorizontalText>
            <HorizontalLine></HorizontalLine>
            <VerticalText >Air Drop</VerticalText>
            <VerticalLine></VerticalLine>
            <Note title="June 18 , 2024">
              <p>But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful.</p>
              <p>But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness.</p>
            </Note>
          </div>
          <div className='flex gap-8 sm:gap-2 items-center justify-between w-full sm:flex-col'>
            <HorizontalText >Check Out</HorizontalText>
            <HorizontalLine></HorizontalLine>
            <VerticalText >Check Out</VerticalText>
            <VerticalLine></VerticalLine>
            <Note title="www.Laughing Hyena.io">
              <p>But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful.</p>
              <p>But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness.</p>
            </Note>
          </div>
        </div>
      </div>
      <div className='flex items-center justify-center p-8 bg-[#1E1F25]' id="abount">
        <div className='flex flex-col items-center justify-center gap-y-8'>
          <div className='w-[254px] drop-shadow-[0_4px_70px_rgba(255,255,255,0.1)]'>
            <img  src={Hyena} alt='hyena'></img>
          </div>
          <span className='text-[48px] font-semibold leading-7 text-white sm:text-[28px]'>Laughing Hyena</span>
          <div className='flex justify-between gap-x-8 sm:gap-2'>
            <img src={Discord} alt='discord' className='sm:w-[40px]'></img>
            <img src={Telegram} alt='telegram' className='sm:w-[40px]'></img>
            <img src={Youtube} alt='youtube' className='sm:w-[40px]'></img>
            <img src={FaceBook} alt='facebook' className='sm:w-[40px]'></img>
          </div>
          <span className='text-[24px] font-medium leading-7 text-white sm:text-[16px]'>©2024 Laughing Hyena. All rights reserved</span>
        </div>
      </div>
    </div>
  );
}

export default Landing;
