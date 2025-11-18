import DashboardLayout from "../../../components/layouts/DashboardLayout";
import InputField from "../../../components/InputField";
import { useState } from "react";
import { jobTitles, allServices } from "../../signup/ServiceProvider/AccountSetup/SkillsSection/jobData";
import Button from "../../../components/button";
import RequestCard from "../../../components/RequestsCard";
import ServiceDetailsModal from "./ServiceDetailsModal";



export default function Bookings() {
    const [selectedJobTitle, setSelectedJobTitle] = useState("");
    const [activeTab, setActiveTab] = useState('request');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const [services, setServices] = useState([]); 

   const serviceOptions = selectedJobTitle ? allServices[selectedJobTitle] || [] : [];

const StatusFilter = ({ activeFilter, onFilterChange }) => {
  const filters = ['All', 'Active', 'Pending', 'Completed'];
  
  return (
    <div className="flex gap-3 mb-6">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter.toLowerCase())}
          className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
            activeFilter === filter.toLowerCase()
              ? 'bg-[#2D6A3E] text-white'
              : 'bg-white text-gray-600 border border-gray-300 hover:border-[#2D6A3E] hover:text-[#2D6A3E]'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

// Sample requests data
  const requests = [
    {
      id: 1,
      title: 'Electrical Installation',
      status: 'Pending',
      providerName: 'Phil Crook',
      providerImage: 'https://i.pravatar.cc/40',
      orderId: 'ORD 001',
      price: 50000,
      deliveryDate: 'Oct 13, 2025',
      scheduledDate: 'Oct 10, 2025 - 9 AM',
      startsIn: '1h 57m 48s',
      ratings: null
    },
    {
      id: 2,
      title: 'Electrical Installation',
      status: 'In Progress',
      providerName: 'Phil Crook',
      providerImage: 'https://i.pravatar.cc/49',
      orderId: 'ORD 001',
      price: 50000,
      deliveryDate: 'Oct 13, 2025',
      scheduledDate: 'Oct 08, 2025 - 10 AM',
      startsIn: null,
      ratings: null
    },
    {
      id: 3,
      title: 'Plumbing Repair',
      status: 'Completed',
      providerName: 'John Smith',
      providerImage: 'https://i.pravatar.cc/45',
      orderId: 'ORD 002',
      price: 35000,
      deliveryDate: 'Oct 05, 2025',
      scheduledDate: 'Oct 01, 2025 - 2 PM',
      startsIn: null,
      ratings: null

    },
     {
      id: 4,
      title: 'Plumbing Repair',
      status: 'Completed',
      providerName: 'John Smith',
      providerImage: 'https://i.pravatar.cc/45',
      orderId: 'ORD 002',
      price: 35000,
      deliveryDate: 'Oct 05, 2025',
      scheduledDate: 'Oct 01, 2025 - 2 PM',
      startsIn: null,
      ratings: 3.0
    },
     {
      id: 5,
      title: 'Plumbing Repair',
      status: 'Waiting confirmation',
      providerName: 'John Smith',
      providerImage: 'https://i.pravatar.cc/45',
      orderId: 'ORD 002',
      price: 35000,
      deliveryDate: 'Oct 05, 2025',
      scheduledDate: 'Oct 01, 2025 - 2 PM',
      startsIn: null,
      ratings: null
    }
  ];
    
  const filteredRequests = requests.filter(request => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return request.status.toLowerCase() === 'in progress';
    return request.status.toLowerCase() === statusFilter;
  });

   const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };
    return (
        <DashboardLayout>

    <div className="max-w-4xl  mx-auto bg-gray-50 min-h-screen">
       <ServiceDetailsModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        request={selectedRequest || {}} 
      />
        <h1 className="text-xl font-semibold p-4">My Bookings</h1>
        
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('request')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'request'
                ? 'text-[#005823] border-b-2 border-[#005823]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Request a service
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'requests'
                ? 'text-[#005823] border-b-2 border-[#005823]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Requests
          </button>
      </div>
              {activeTab === 'request' ? (

           <form  className="flex flex-col gap-4 mb-9 p-5">
            
    <InputField
            label="Select work category"
            select
            options={jobTitles}
            // value={values.title} 
            onChange={(option) => {
            //   setFieldValue("title", option.value);
              setSelectedJobTitle(option.value);
            //   setFieldValue("service", ""); 
              setSelectedService("");
            }}
          />

      <InputField
           label="Sub-category"

           select
           options={[{ label: "Select Services", value: "" }, ...serviceOptions]}
        //    value={values.service} // ✅ also Formik-controlled
           onChange={(option) => {
            //  setFieldValue("service", option.value);
             setSelectedService(option.value);
           }}
           disabled={!selectedJobTitle}
         />
         <InputField
                 name="Title"
                 label="Request a title"
                 placeholder="e.g Need an electrician home wiring."
               />
               <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Description
            </label>
            <textarea
            //   value={formData.description}
            //   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell us the details of your task"
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-md placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#8BC53F] focus:border-transparent"
            />
          </div>
          
              
              <InputField
                                  name="gender"
                                  label="Service Type"
                                  select
                                  options={[
                                    { label: "Select service type", value: "" },
                                    { label: "Immediate", value: "null" },
                                    { label: "Schedule", value: "male" },
                                  ]}/>
              {/* <Calendar className="absolute left top-3/5 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" /> */}
          

                <InputField
            label="Preferred time"
            select
 options={[
                      { label: "Select Time", value: "" },
                      { label: "8:00 A.M", value: "null" },
                      { label: "12:00 P.M", value: "male" },
                      { label: "2:00 P.M", value: "female" },
                    ]}            // value={values.title} 
            onChange={(option) => {
            //   setFieldValue("title", option.value);
              setSelectedJobTitle(option.value);
            //   setFieldValue("service", ""); 
              setSelectedService("");
            }}
          />
                  <InputField
                 name="Title"
                 label="Location"
                 placeholder="Your Location"
               />
                <InputField
                 name="Title"
                 label="Budget"
                 placeholder="Enter Amount"
               />

               <div className=" flex flex-col items-center justify-center">
    <Button variant="secondary">Post request</Button>
   
    </div>
    
                  
    </form>
    
                  ) : (

            <div className="mt-5">
            {/* Status Filter */}
            <StatusFilter activeFilter={statusFilter} onFilterChange={setStatusFilter} />
            
            {/* Request Cards */}
            <div className="space-y-4">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <RequestCard 
                  key={request.id} 
                  request={request} 
                    onViewDetails={handleViewDetails}

                  
                  />
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-lg">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No requests found</h3>
                  <p className="text-gray-600">No requests match the selected filter.</p>
                </div>
              )}
            </div>
          </div>
        )}
              </div>
            

        </DashboardLayout>

    )
}