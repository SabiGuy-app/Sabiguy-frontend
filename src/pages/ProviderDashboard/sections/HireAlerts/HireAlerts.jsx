import ProviderDashboardLayout from "../../../../components/layouts/ProviderDashboardLayout";
import { useState } from "react";
import JobsCard from "../../../../components/provider-dashboard/JobsCard";
import AlertsCard from "../../../../components/provider-dashboard/AlertsCard";
import AlertDetailsModal from "./AlertDetails";
import JobDetailsModal from "./JobDetails";
import MarkAsCompleted from "../../../../components/provider-dashboard/MarkAsCompleted";

export default function HireAlerts () {
    const [activeTab, setActiveTab] = useState('alert');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isJobModalOpen, setIsJobModalOpen] = useState(false);
    const [isMarkOpen, setIsMarkOpen] = useState(false);


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
  const jobs = [
  {
      id: 1,
      title: 'Electrical Installation',
      status: 'Pending',
      providerName: 'Phil Crook',
      price: 50000,
      deliveryDate: 'Oct 13, 2025',
      scheduledDate: 'Oct 08, 2025 - 10 AM',
      startsIn: '1h 57m 48s',
      ratings: null,
      est_completed: null,
      completed: null,
       location: "Lekki phase 1"

    },
    {
      id: 2,
      title: 'Electrical Installation',
      status: 'In Progress',
      providerName: 'Phil Crook',
      price: 50000,
      deliveryDate: 'Oct 13, 2025',
      scheduledDate: 'Oct 08, 2025 - 10 AM',
      startsIn: null,
      ratings: null,
      est_completion: "4 hours",
      completed: null
    },
    {
      id: 3,
      title: 'Electrical Installation',
      status: 'Waiting confirmation',
      providerName: 'Phil Crook',
      price: 50000,
      deliveryDate: 'Oct 13, 2025',
      scheduledDate: 'Oct 08, 2025 - 10 AM',
      startsIn: null,
      ratings: null,
      est_completed: null,
      completed: "30 mins ago",
      location: "Lekki phase 1"

    },
    {
      id: 4,
      title: 'Electrical Installation',
      status: 'Completed',
      providerName: 'Phil Crook',
      price: 50000,
      deliveryDate: 'Oct 13, 2025',
      scheduledDate: 'Oct 08, 2025 - 10 AM',
      startsIn: null,
      ratings: null,
      est_completed: null,
      completed: "5 days ago"
    },
  ];

  
// Sample requests data
  const alerts = [
    {
      id: 1,
      title: 'Electrical Installation',
      status: 'New',
      distance: '2.3 km away',
      price: 50000,
      deliveryDate: 'Oct 13, 2025',
      scheduledDate: 'Oct 10, 2025 - 9 AM',
      posted: '15 min ago',
      offerSent:null,
      location: "Lekki phase 1"
    },
    {
      id: 2,
      title: 'Electrical Installation',
      status: 'Awaiting Response',
      distance: '2.3 km away',
      price: 50000,
      deliveryDate: 'Oct 13, 2025',
      scheduledDate: 'Oct 10, 2025 - 9 AM',
      posted: null,
      offerSent: "10 min ago",
      location: "Lekki phase 1"


    },
  ];

  const filteredJobs = jobs.filter(job => {
  const status = job.status.toLowerCase();

  if (statusFilter === 'all') return true;

  if (statusFilter === 'active') {
    return status === 'in progress' || status === 'waiting confirmation';
  }

  return status === statusFilter;
});

 const handleViewAlert = (alert)  => {
  setSelectedAlert(alert);
  setIsAlertModalOpen(true);
 };

 const handleCloseAlert = () => {
   setIsAlertModalOpen(false);
   setSelectedAlert(null)
 };

 const handleViewJob = (job)  => {
  setSelectedJob(job);
  setIsJobModalOpen(true);
 };

 const handleCloseJob = () => {
   setIsJobModalOpen(false);
   setSelectedJob(null)
 };

 const handleMark = (job)  => {
  setSelectedJob(job);
  setIsMarkOpen(true);
 };

 const handleCloseMark = ()  => {
  setSelectedJob(false);
  setIsMarkOpen(null);
 };

  return (
    <ProviderDashboardLayout>
      <AlertDetailsModal
      isOpen={isAlertModalOpen}
      onClose={handleCloseAlert}
      alert={selectedAlert || {}}  
      />

      <JobDetailsModal
      isOpen={isJobModalOpen}
      onClose={handleCloseJob}
      job={selectedJob || {}}
      />

      <MarkAsCompleted
      isOpen={isMarkOpen}
      onClose={handleCloseMark}
      job={selectedJob || {}}


      
      />

        <div className="flex border-b mb-3">
            <button
            onClick={() => setActiveTab('alert')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'alert'
                ? 'text-[#005823] border-b-2 border-[#005823]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Hire Alerts
          </button>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === 'jobs'
                ? 'text-[#005823] border-b-2 border-[#005823]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Jobs
          </button>
        </div>

        {activeTab === 'alert' ? (
            <div className="space-y-4 mt-3">
            {alerts.length > 0 ? (
                alerts.map((alert) => ( 
                  <AlertsCard
                    key = {alert.id}
                    alert = {alert}
                    onViewDetails={handleViewAlert}
                    
                    />
                ))
              ) : (
            <p className="text-sm text-gray-500">No alerts available</p>
              )}

            </div>
        ) : (
            <div>
            <StatusFilter activeFilter={statusFilter} onFilterChange={setStatusFilter} />

            <div className="space-y-4">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                        <JobsCard
                        key = {job.id}
                        job = {job}
                        onViewDetails={handleViewJob}
                        onMarkAsCompleted={handleMark}
                        
                        />
                    ))
                  ) : (
               <p className="text-sm text-gray-500">No jobs found</p>
                  )}            
            </div>
            </div>      
        )}
    </ProviderDashboardLayout>
  )
}