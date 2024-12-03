import React from 'react';
import Wallet from './wallet';

import Fin from "../../asset/svg/fin.svg"
import Cosmostation from "../../asset/svg/cosmostation.svg"
import Compass from "../../asset/svg/compass.svg"
import Kelpr from "../../asset/svg/kelpr.svg"
import Leap from "../../asset/svg/leap.svg"

const wallets = [
  { title: "Fin", ico: Fin },
  { title: "Compass", ico: Compass },
  { title: "Cosmostation", ico: Cosmostation },
  { title: "Kelpr", ico: Kelpr },
  { title: "Leap", ico: Leap },
]

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className=' fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50'>
      <div className='bg-[#0b1734DD] p-[20px] sm:p-[4px] w-[628px] sm:w-full flex flex-col gap-[40px] sm:gap-[12px] border-[3px] border-[#FFFFFFAA] rounded-[64px] sm:rounded-[20px] '>
        <h2 className='text-[50px] sm:text-24px font-semibold leading-16 text-white mb-[24px]'>Connect Wallet</h2>
        <div className=' w-full flex flex-col gap-[40px] '>
          
          <Wallet title={wallets[0].title} ico={wallets[0].ico} kind="fin" ></Wallet>
          <Wallet title={wallets[1].title} ico={wallets[1].ico} kind="compass" ></Wallet>
          <Wallet title={wallets[2].title} ico={wallets[2].ico} kind="cosmostation" ></Wallet>
          <Wallet title={wallets[3].title} ico={wallets[3].ico} kind="kelpr" ></Wallet>
          <Wallet title={wallets[4].title} ico={wallets[4].ico} kind="leap" ></Wallet>
        </div>
        <div className='w-full bg-[#684f30] h-[96px] sm:h-[40px] cursor-point flex justify-center items-center cursor-pointer rounded-[15px] mt-[28px] mb-[28px]' onClick={onClose}><span className='text-[40px] sm:text-[28px] font-semibold text-white'>Close Modal</span></div>
      {/* <div className='w-[1248px] bg-[#A17948] h-[128px] cursor-point' onClick={onClose}>
        <span className='text-[40px] font-semibold leading-6'>Close Modal</span>
      </div> */}
      </div>
    </div>
  );
}

export default Modal;
