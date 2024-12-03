
const HorizontalLine = (props) => {
    return (
        <div className="hidden sm:inline-flex flex flex-row justify-center items-center ">
            <div className='w-[110px] h-[2px] bg-gradient-to-r from-[#A17948] to-[#1B70F1] '></div>
            <div className={`w-[30px] h-[30px] bg-[#A17948] rounded-full flex justify-center items-center border-[#15161F] border-[2px] outline-[#A17948] outline-4`}></div>
            <div className='w-[110px] h-[2px] bg-gradient-to-r from-[#A17948] to-[#1B70F1] '></div>
        </div>
    );
  }
  
  export default HorizontalLine;
  