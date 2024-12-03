
import { Link } from 'react-router-dom';

const ToggleButton = (props) => {
  return (
      <div className={`w-[247.63px] sm:w-[160px] cursor-pointer border-[5.36px] sm:border-[2px] border-[#A17948] rounded-full sm:rounded-[10px] px-5 py-2.5 `} >
        <Link to='/presale' className='flex justify-between items-center'>
            <div className={`text-[24.12px] sm:text-[16px]  text-white`} {...props}></div>
            <div className={`w-[42.88px] sm:w-[24px] h-[42.88px] sm:h-[24px] bg-white rounded-full flex justify-center items-center`}>{">"}</div>
        </Link>
      </div>
  );
}

export default ToggleButton;
