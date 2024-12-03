import { Children } from "react";
import PLS from "../../asset/img/pls.png"
import Down from "../../asset/svg/down.svg"
import TokenModal from "../modal/tokenModal";

import SEI from "../../asset/img/sei.png"
import USDT from "../../asset/svg/usdt.svg"
import "../component.css"

import {useState, useRef, useEffect} from 'react'

const SwapInput = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [coin, setCoin] = useState(0);
    const inputValue = useRef();

    const setPayValue = () => {
        props.set(inputValue.current.value);
        props.setToken(inputValue.current.value)
    }

    useEffect(() => {
        inputValue.current.value = props.value;
    }, [props.value])

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    return (
		<>
        <div className="bg-[#EEEEEE1A] w-full flex justify-between p-2.5 items-center sm:p-0.5 ">
            <input className="text-[36.82px] font-normal leading-6 bg-transparent outline-0 w-[80%] sm:text-[20px]" {...Children} ref={inputValue} onChange={setPayValue} type="number" placeholder="0"></input>
            <div className="text-white bg-[#EEEEEE1A]  rounded-lg text-sm px-1 py-1 text-center inline-flex items-center dark:bg-[#EEEEEE1A] cursor-pointer relative" id="dropdownDefaultButton " onClick={openModal}>
			<div className=" w-full group ">
				<button className=" peer flex justify-center items-center">
					<img src={props.coin == 0? SEI: USDT} alt="pls" className="w-[45.7px] h-[45.7px] sm:h-[28px] ml-[10px]"></img>
					<div className="text-[36.82px] font-normal leading-6 sm:text-[28px] ml-[5px]">{props.coin == 0? "SEI": "USDT"}</div>
					<img src={Down} alt="narrow" className="sm:w-[24px] ml-[5px] pr-[10px]"></img>
				</button>
			</div>
            </div>
        </div>
            <TokenModal isOpen={isModalOpen} onClose={closeModal} setCoin={props.setCoin}></TokenModal>
		</>
    );
  }
  
  export default SwapInput;
  