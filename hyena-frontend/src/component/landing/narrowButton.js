
const NarrowButton = (props) => {
    return (
          <div className={`w-[${props.width}] h-[${props.height}] bg-white rounded-full flex justify-center items-center`} {...props}></div>
    );
  }
  
  export default NarrowButton;
  