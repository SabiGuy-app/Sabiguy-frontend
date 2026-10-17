import { useState } from "react";
import { recentDaysIncome } from "../../data/mockEarnings";
import { formatNairaTrip } from "../../utils/format";

const IncomeChart = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="w-full rounded-xl border-[0.4px] px-4 py-5 border-[#231F201A] flex flex-col gap-3">
      <div className="mb-12">
        <h3 className="font-semibold text-[#231F20]">Recent days Income</h3>
        <p className="text-sm text-[#231F20BF]">
          Understand when you get the most bookings
        </p>
      </div>

      <div className="flex w-full h-full justify-between items-end gap-1.5 sm:gap-3">
        {recentDaysIncome.map((data, index) => {
          const isActive = activeIndex === index;

          const handleOnClick = () => setActiveIndex(isActive ? null : index);
          const handleOnMouseEnter = () => setActiveIndex(index);
          const handleOnMouseLeave = () => {
            setActiveIndex((prev) => (prev === index ? null : prev));
          };

          return (
            <div
              className="w-full flex flex-col gap-3 group relative z-0 hover:z-10"
              key={index}
            >
              <Trips
                trips={data.trips}
                amount={formatNairaTrip(data.amount)}
                isActive={isActive}
              />
              <ChartBar
                height={data.percentage}
                handleOnMouseEnter={handleOnMouseEnter}
                handleOnMouseLeave={handleOnMouseLeave}
                handleOnClick={handleOnClick}
              />
              <p className="text-[10px] max-md:text-[8px] text-[#231F20BF] -tracking-tighter text-center">
                {data.day}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IncomeChart;

const ChartBar = ({
  height,
  handleOnMouseEnter,
  handleOnMouseLeave,
  handleOnClick,
}) => {
  return (
    <>
      <div className="group relative w-full ">
        <div
          onClick={handleOnClick}
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
          style={{ height: `${height}px` }}
          className="w-full rounded-sm bg-[#33794F] cursor-pointer"
        />
      </div>
    </>
  );
};

const Trips = ({ trips, amount, isActive }) => {
  return (
    <div
      className={`absolute -top-17 transition-all duration-300 ease-in-out group-hover:block z-20 ${isActive ? "opacity-100" : "opacity-0"}`}
    >
      <div className="absolute -bottom-1 left-1/2 bg-white -translate-x-1/2 shadow border-r border-b border-[#231F201A] size-3 rotate-45 z-20" />
      <div className="w-full flex flex-col relative rounded-md bg-white p-3 z-20">
        <span className="text-sm text-[#005823] font-semibold">{amount}</span>
        <span className="text-[10px] text-[#231F20BF]">{trips} Trips</span>
      </div>
    </div>
  );
};
