import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../component/modal/modal';
import Logo from "../asset/img/hyena.png"
import WalletConnectButton from '../component/landing/walletConnetButton';


const Header = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeModal = () => setIsModalOpen(false);
    let navigate = useNavigate();

    const toLanding = () => {
        navigate('/'); // Change '/other-page' to your desired route
    }
    const toRead = () => {
        navigate('#read'); // Change '/other-page' to your desired route
    }
    const toAbout = () => {
        navigate('#about'); // Change '/other-page' to your desired route
    }
    const toContact = () => {
        navigate('#contact'); // Change '/other-page' to your desired route
    }
    const toLegal = () => {
        navigate('#legal'); // Change '/other-page' to your desired route
    }
    return (
        <>
            <div className="bg-[#1E1F25]  w-full sticky top-0 h-[120px] sm:h-[80px] z-10 flex items-center">
                <div >
                    <img src={Logo} alt="logo" className="w-[90px] top-3.5 left-8 sm:left-2  absolute cursor-pointer sm:h-[60px] sm:w-[60px] sm:top-2.5" onClick={toLanding} ></img>
                </div>
                <div className="w-[433px] h-[28px] top-[46px] left-[154px] sm:hidden flex justify-between  absolute">
                    <span className="text-white text-[20px] leading-4 font-medium cursor-pointer" onClick={toRead}>Read</span>
                    <span className="text-white text-[20px] leading-4 font-medium cursor-pointer" onClick={toAbout}>About</span>
                    <span className="text-white text-[20px] leading-4 font-medium cursor-pointer" onClick={toContact}>Contact Us</span>
                    <span className="text-white text-[20px] leading-4 font-medium cursor-pointer" onClick={toLegal}>Legal</span>
                </div>
                <div className="w-[200px] h-[56px] top-8 right-8 sm:right-2 flex justify-center items-center bg-[#A17948] cursor-pointer absolute rounded-[5px] sm:top-[12px]">
                    <WalletConnectButton><span className="text-white text-[20px] leading-4 font-normal" >Connect Wallet</span></WalletConnectButton>

                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal}></Modal>
        </>
    );
}

export default Header;
