import { User } from "lucide-react";
import individual from "/public/Individual.svg";
import business from "/public/Business.svg";
import { Link } from "react-router-dom";

const AccountTypeModal = ({ isOpen, setIsOpen }) => {
  const heading = "Account Type";
  const subHeading =
    "Before you get started, we need to confirm your account type. We require this to make your profile setup easier";

  const accountType = [
    {
      id: 0,
      icon: individual,
      name: "Individual",
      text: "Ideal for freelancers and independent professionals looking to offer services and manage client bookings.",
      path: "/service-provider/signup",
    },
    {
      id: 1,
      icon: business,
      name: "Business",
      text: "Built for companies and service teams that want to coordinate staff, manage operations, and serve more customers efficiently.",
      path: "/business-provider/signup",
    },
  ];

  if (!isOpen) return null;

  return (
    <div
      className="w-full h-screen fixed inset-0 bg-black/20 flex justify-center items-center z-20 px-4"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-[500px] max-h-[85vh] bg-white rounded-2xl p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 shadow shadow-[#0000001A] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-lg sm:text-xl text-[#231F20]">
            {heading}
          </h3>
          <p className="text-sm sm:text-base text-[#231F20BF]">{subHeading}</p>
        </div>

        <div className="w-full flex flex-col gap-4 sm:gap-6">
          {accountType.map(({ id, name, icon, text, path }) => (
            <Link
              to={path}
              key={id}
              className="flex gap-3 rounded-lg border p-3.5 sm:p-4.5 border-[#231F2026] transition hover:shadow-xl hover:border-green-600"
            >
              <img
                className="w-8 h-8 sm:w-9 sm:h-9 shrink-0"
                src={icon}
                alt=""
              />
              <div className="flex flex-col gap-2 sm:gap-3 justify-center items-start">
                <div className="flex justify-between items-center w-full">
                  <h4 className="text-[#231F20BF] font-semibold">{name}</h4>
                  <div className="w-4.5 h-4.5 rounded-full border-[1.5px] border-[#231F2026] shrink-0" />
                </div>
                <p className="text-left font-normal text-[#231F20BF] text-[13px]">
                  {text}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountTypeModal;
