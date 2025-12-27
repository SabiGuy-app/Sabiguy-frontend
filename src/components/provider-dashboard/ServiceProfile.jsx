import { Pencil, Trash2 } from "lucide-react";
import AddService from "../../pages/signup/ServiceProvider/AccountSetup/SkillsSection/AddService";
import { useState } from "react";
import { IoIosArrowBack, IoIosAdd } from "react-icons/io";


export default function ProviderServiceProfileTab({ profile, onProfileUpdate }) {
   const [addService, setAddService] = useState(false)
      const [electedServices, setSelectedServices] = useState([]); 
      const [editingService, setEditingService] = useState(null);


      const services = [
        {
           id: 1,
      name: 'Electrical Installation',
      price: 50000,
      pricingModelLabel: "daily"
        },
        {
           id: 2,
      name: 'Electrical Installation',
      price: 50000,
      pricingModelLabel: "daily"
        }

      ]
  return (
    <div className="mb-12">
      
      <form className="space-y-6">
          

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Work Category
          </label>
          <input
            type="text"
            defaultValue={profile.work}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent bg-gray-50"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sub-Category
          </label>
          <input
            type="text"
            defaultValue={profile.sub}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent bg-gray-50"
          />
        </div>
         <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tagline/Headline
          </label>
          <input
            type="text"
            defaultValue={profile.tagline}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent bg-gray-50"
          />
        </div>
        <div>

<p className="font-semibold text-xl">Add your Services & Pricing</p>
     <p>List the services you offer and set fair prices so customers know what to expect.</p>
<div className="flex flex-col gap-3 mt-3">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex items-center justify-between border border-gray-300 rounded-lg p-3 shadow-sm bg-white"
              >
                <div>
                  <h3 className="font-semibold text-lg">{service.name}</h3>
                  <p className="text-green-700 font-semibold">
                    ₦{service.price}
                    <span className="text-gray-500 font-normal ml-2">
                      • {service.pricingModelLabel}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <Pencil className="w-4 h-4 cursor-pointer hover:text-gray-700" 
                  onClick={() => handleEditService(service, index)}
                  />
                  <Trash2
                    className="w-4 h-4 cursor-pointer hover:text-red-600"
                    onClick={() => handleDeleteService(index)}
                  />
                </div>
              </div>
            ))}
          </div>
     <button type="button" className="flex item-center justify-center w-full mt-3 gap-1 border border-gray-300 rounded-md  py-1 font-semibold text-gray-700 bg-white hover:bg-[#8BC53FBF] transition"
     onClick={() => setAddService(true)}>
  <IoIosAdd size={25} className=" text-gray-600" />
  <span>Add New Service</span>
</button>
</div>
<h3 className="font-semibold border-t border-gray-300"></h3>


<h3 className="font-semibold ">Portfolio/Work Gallery</h3>

       <div className="bg-white border border-gray-400 rounded-2xl shadow p-5">


<div>
  <h3 className="mb-3">Videos</h3>
<div className="grid grid-cols-2 md:grid-cols-3 gap-3">

                <img
                  src="/portfolio.jpg"
                  alt="Work"
                  className="w-full h-40 object-cover rounded-lg border"
                />

                <img
                  src="/portfolio.jpg"
                  alt="Work"
                  className="w-full h-40 object-cover rounded-lg border"
                />
            
            </div>
            </div>
            

       </div>
        <div className="bg-white border border-gray-400 rounded-2xl shadow p-5">


<div>
  <h3 className="mb-3">Pictures</h3>
<div className="grid grid-cols-2 md:grid-cols-3 gap-3">

                <img
                  src="/portfolio.jpg"
                  alt="Work"
                  className="w-full h-40 object-cover rounded-lg border"
                />

                <img
                  src="/portfolio.jpg"
                  alt="Work"
                  className="w-full h-40 object-cover rounded-lg border"
                />
            
            </div>
            </div>

       </div>

        <div>
            <h2 className="font-semibold mt-3 mb-3">Bank Account</h2>
           <label className="block text-sm font-medium text-gray-700 mb-2">
            Bank
          </label>
          <input
            type="text"
            defaultValue={profile.tagline}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent bg-gray-50"
          />
        </div>
         <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account number
          </label>
          <input
            type="text"
            defaultValue={profile.acc_num}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent bg-gray-50"
          />
        </div>
         <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Name
          </label>
          <input
            type="text"
            defaultValue={profile.acc_name}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent bg-gray-50"
          />
        </div>
         <AddService
                isOpen={addService}
                onClose={() => {
                       setAddService(false);
                      //  setEditingService(null)
                }}
                  // onSave={handleSaveService}
                  // editingService={editingService}
        
                />
      </form>
    </div>
  );
}