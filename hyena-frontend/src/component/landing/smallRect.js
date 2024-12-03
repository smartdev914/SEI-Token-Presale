
const SmallRect = (props) => {
    return (
          <div className={`w-[80px] h-[80px] font-bold border-white border-[1px] rounded-[10px] sm:border-[1px] sm:rounded-[10px] flex items-center flex-col justify-center sm:font-normal shadow-lg shadow-[#A17948]`}>
              <div className="text-[45px] leading-none   text-white sm:text-[32px] animation-pulse">{props.value}</div>
              <div className="text-[18px] text-white sm:text-[12px] sm:pb-0">{props.type}</div>
          </div>
    );
  }
  
  export default SmallRect;
  