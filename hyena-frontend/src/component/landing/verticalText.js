
const VerticalText = (props) => {
    return (
          <div className={`text-[46px] text-[#A17948] -rotate-180 sm:hidden`} style={{writingMode: 'vertical-lr'}}  {...props}></div>
    );
  }
  
  export default VerticalText;
  