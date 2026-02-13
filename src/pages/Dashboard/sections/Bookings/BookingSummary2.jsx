import React, { useState } from "react";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  User,
  Clock,
  Star,
  MapPin,
  Navigation,
} from "lucide-react";
import bookingCar from "../../../../../public/bookings.png";
import Navbar from "../../../../components/dashboard/Navbar";
import { FiChevronLeft } from "react-icons/fi";

export default function BookingSummary2() {
  const [selectedPayment, setSelectedPayment] = useState("wallet");
  const [notes, setNotes] = useState("");

  return (
    <>
      <Navbar />
      <div className="bg-[#f7f7f7]">
        <div className="max-w-3xl mx-20  p-4 sm:p-6 bg-white">
          <div className="flex items-center gap-3 mb-6 ">
            <button className="text-gray-600 hover:text-gray-900">
              <FiChevronLeft size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              Booking summary
            </h1>
          </div>
          {/* Driver Info */}
          <div className="flex items-start gap-4 mb-6">
            <div className="relative">
              <img
                src={bookingCar}
                alt="Marcus Johnson"
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>

            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold text-gray-900">
                  Marcus Johnson
                </h2>
                <span className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 text-xs font-medium rounded">
                  ✓ Verified
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                Toyota Corolla · KSF257NG
              </p>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-gray-900">4.9</span>
                <span className="text-gray-500">(25 reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>2.7 miles away</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="flex flex-col justify-center items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full">
                  <User className="w-5 h-5" />
                </div>
                <div className="text-lg font-semibold text-gray-900">25</div>
                <div className="text-xs text-gray-500">Jobs Done</div>
              </div>
              <div className="flex flex-col justify-center items-center">
                <div className="flex items-center justify-center w-10 h-10">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {"< 3 Mins"}
                </div>
                <div className="text-xs text-gray-500">Response Time</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10">
                  <Star className="w-5 h-5" />
                </div>
                <div className="text-lg font-semibold text-gray-900">4.9</div>
                <div className="text-xs text-gray-500">Rating</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Phone className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-700">Call</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <MessageCircle className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-700">Message</span>
            </button>
            <button className="text-red-500 font-medium px-4 hover:text-red-600 transition-colors">
              Cancel Request
            </button>
          </div>

          {/* Vehicle Image */}
          <img
            src={bookingCar}
            alt="Vehicle"
            className="w-full h-auto object-contain"
          />

          {/* Job Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Job Summary
            </h3>

            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex items-center justify-center w-5 h-5 bg-green-500 rounded-full mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Pickup Location
                  </div>
                  <div className="text-sm text-gray-600">
                    24 Palm Avenue, Lagos
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex items-center justify-center w-5 h-5 bg-green-500 rounded-full mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Dropoff Location
                  </div>
                  <div className="text-sm text-gray-600">
                    24 Palm Avenue, Lagos
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Navigation className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">
                    Estimated Distance
                  </div>
                  <div className="text-sm text-gray-600">10 Kilometre</div>
                </div>
              </div>
            </div>
          </div>

          {/* Cost */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost</h3>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service Cost</span>
                <span className="font-medium text-gray-900">₦10,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service Charge</span>
                <span className="font-medium text-gray-900">₦200</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">
                    Total Amount
                  </span>
                  <span className="font-semibold text-green-600">₦10,200</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Payment Method
            </h3>

            <div className="space-y-3">
              <label
                className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedPayment === "wallet"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="wallet"
                  checked={selectedPayment === "wallet"}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                  className="w-5 h-5 text-green-600"
                />
                <div className="flex items-center gap-3 flex-grow">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Wallet</div>
                    <div className="text-sm text-gray-500">
                      Balance: ₦60,000
                    </div>
                  </div>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedPayment === "online"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={selectedPayment === "online"}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                  className="w-5 h-5 text-green-600"
                />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="font-medium text-gray-900">Pay Online</div>
                </div>
              </label>
            </div>

            <button className="w-full mt-3 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium bg-[#fbfbfb] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <span className="text-xl">+</span>
              <span>Add Payment Method</span>
            </button>
          </div>

          {/* Additional Notes */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Additional notes (optional)
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add extra instructions for the service provider.."
              className="w-full p-4 border-2 border-gray-200 bg-[#fbfbfb] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows="4"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pb-6">
            <button className="flex-1 py-4 px-6 border border-gray-300 rounded-[4px] text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button className="flex-1 py-4 px-6 bg-[#005823CC] text-white rounded-[4px] font-semibold hover:bg-green-700 transition-colors">
              Confirm & Pay ₦10,200
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
