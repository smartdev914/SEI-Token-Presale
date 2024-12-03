import React from 'react';
import Wallet from './wallet';
import "./modal.css"

import SEI from "../../asset/img/sei.png"
import USDT from "../../asset/svg/usdt.svg"

const tokens = [
  { title: "SEI", ico: SEI },
  { title: "USDT", ico: USDT },
]

const TokenModal = ({ isOpen, onClose, setCoin }) => {
  if (!isOpen) return null;

  return (
    <div className=' fixed top-0 left-0 right-0 bottom-0 flex items-center sm:items-end justify-center z-50 bg-[#ffffff33]'>
      <div className='w-full h-full backdrop-blur-sm' onClick={onClose}></div>
      <div className='absolute rounded-[10px] bg-[#0b1734DD] w-[480px] p-[20px] sm:p-[4px] sm:w-full flex flex-col gap-[10px] sm:gap-[5px] border-[1px] border-[#666666AA] shadow-xl'>
        <div className='flex justify-between relative items-center'>
          <h2 className='text-[32px] sm:text-[20px] font-semibold text-align-left leading-16 text-white '>Select token</h2>
          <button className="close-button flex justify-center items-center" onClick={onClose}>×</button>
        </div>
        <div className=' w-full flex flex-col gap-[10px] '>
          <Wallet title={tokens[0].title} ico={tokens[0].ico}  Close={onClose} setCoin={setCoin} coinVal={0}></Wallet>
            <Wallet title={tokens[1].title} ico={tokens[1].ico} Close={onClose} setCoin={setCoin} coinVal={1}></Wallet>
          
        </div>
      </div>
    </div>
  );
}

export default TokenModal;
