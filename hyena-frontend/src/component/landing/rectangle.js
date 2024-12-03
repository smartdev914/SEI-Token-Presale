
const Rectangle = (props) => {
  return (
        <div className={`w-[248.62px] sm:w-[64px] h-[254.76px] sm:h-[64px] font-bold border-[#A17948] border-[12.28px] rounded-[30.69px] sm:border-[3px] sm:rounded-[10px] flex items-center flex-col justify-center`}>
            <div className="text-[138.12px] leading-none   text-white sm:text-[16px] sm:px-0 sm:w-[70px]">{props.value}</div>
            <div className="text-[42.97px] pb-2.5 text-white sm:text-[12px] sm:pb-0">{props.type}</div>
        </div>
  );
}

export default Rectangle;
