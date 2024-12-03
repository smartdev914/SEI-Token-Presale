

const PriceCard = (props) => {
  return (
    <div className="flex flex-col gap-y-2 items-center bg-[#1E1F25] w-full justify-between items-center py-[22px] sm:flex-row sm:p-[12px] rounded-[10px] shadow-md">
      <div className="flex flex-col justify-start sm:items-start gap-[10px] ">
        <span className="text-[34px] font-semibold leading-10 text-white sm:text-[28px]">{props.price}</span>
        <span className="text-[30px] font-semibold leading-9 text-[#A17948] sm:text-[20px]">{props.state}</span>
      </div>
      <span className="text-[18px] font-semibold leading-7 text-white sm:text-[20px]">{props.description}</span>
    </div>
  );
}

export default PriceCard;
