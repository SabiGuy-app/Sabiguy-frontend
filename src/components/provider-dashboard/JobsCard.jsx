import {
  ChevronDown,
  Calendar,
  MapPin,
  Send,
  Clock,
  Star,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";

// Reusable Request Card Component
export default function JobsCard({ job, onViewDetails, onMarkAsCompleted }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusStyles = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-[#FFC107] border-yellow-200",
      active: "bg-blue-100 text-blue-600 border-blue-200",
      "in progress": "bg-blue-100 text-blue-800 border-blue-200",
      "waiting confirmation": "bg-orange-200 text-orange-800 border-orange-200",

      completed: "bg-green-100 text-green-700 border-green-200",
    };
    return styles[status.toLowerCase()] || styles.pending;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
      

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  {job.title}
                </h3>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusStyles(
                    job.status
                  )}`}
                >
                  {job.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Provider: {job.providerName}
              </p>
              {/* <p className="text-sm text-gray-500">
                Order ID: {request.orderId}
              </p> */}
            </div>

            {/* Price Section */}
            <div className="text-right">
              <div className="text-2xl font-bold text-[#2D6A3E]">
                ₦{job.price.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">
                Delivery: {job.deliveryDate}
              </p>
            </div>
          </div>

          {/* Date and Time Info */}
          <div className="flex flex-col gap-2 mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#2D6A3E]" />
              <span>{job.scheduledDate}</span>
            </div>
            {job.status.toLowerCase() === "in progress" && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">
                  Est. Completion: {job.est_completion}
                </span>
              </div>
            )}
            {job.status.toLowerCase() === "pending" && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">
                  Starts in: {job.startsIn}
                </span>
              </div>
            )}
             {(
              job.status.toLowerCase() === "waiting confirmation" || 
                job.status.toLowerCase() === "completed" ) && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">
{job.status.toLowerCase() === "completed"
        ? `Completed ${job.completed}`
        : `Completed ${job.completed}`}                </span>
              </div>
            )}
          </div>
          {/* Buttons */}
          <div className="flex gap-3 border-t">
            {job.status.toLowerCase() !== "completed" && (
            <button
              onClick={() => onViewDetails(job)}
              className="px-3 py-1 mt-3 bg-[#2D6A3E] text-white rounded-lg font-medium hover:bg-[#1f4a2a] transition-colors"
            >
              View Details
            </button>
            )}
          {job.status.toLowerCase() === "completed" && (
            <div className="mt-3">
            <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            
                          ))}
                        </div>                       
                        <p className="text-gray-500 mt-1 text-sm">He did a very good job</p>
                        </div>
                      )}
            {job.status.toLowerCase() === "in progress" && (
              <button 
              onClick={() => onMarkAsCompleted(job)}
              className="px-3 py-1 mt-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                Mark as Completed
              </button>
            )}
             {job.status.toLowerCase() === "pending" && (
              <button className="px-3 py-1 mt-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                En route
              </button>
            )}
             {job.status.toLowerCase() === "waiting confirmation" && (
              <button className="px-3 py-1 mt-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                Awaiting customer's review
              </button>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
