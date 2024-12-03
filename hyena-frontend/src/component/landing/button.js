

const Button = (props) => {
  return (
        <button className={`w-[200px] sm:w-[128px] h-[56px] text-[20px] bg-[${props.bg}] flex items-center justify-center rounded-[4px] border-[1px] border-[#A17948] text-white`} {...props}>            
        </button>
  );
}

export default Button;
