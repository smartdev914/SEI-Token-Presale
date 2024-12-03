

const Note = (props) => {
    return (
      <div className="p-[40px] bg-[#1E1F25] flex flex-col items-start">
            <span className="text-left text-[32px] font-semibold mb-8 text-white">{props.title}</span>
          <span className={`text-left text-2xl content-start text-white`} {...props}></span>
      </div>
    );
  }
  
  export default Note;
  