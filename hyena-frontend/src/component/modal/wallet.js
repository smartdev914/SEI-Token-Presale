import React from 'react';

const Wallet = (props) => {

  const setValue = () => {
    props.setCoin(props.coinVal);
    props.Close();
  }


  return (
    <div className='h-[60px] sm:h-[15px] flex flex-row justify-between items-center border-[1px] border-[#FFFFFF44] rounded-[10px] p-[10px] sm:p-[20px] cursor-pointer token-item' onClick={setValue} onBlur={props.onClick}>
        <div className="flex justify-center items-center gap-4">
            <img className="w-[40px] sm:w-[28px]" src={props.ico} alt="icon"></img>
            <div className="text-[30px] sm:text-24px font-normal text-white">{props.title}</div>
        </div>
    </div>
  );
}

export default Wallet;
