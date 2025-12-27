
export default function BookingsByDayOfWeek() {
   const dayData = [
    { day: "Mon", bookings: 8 },
    { day: "Tue", bookings: 14 },
    { day: "Wed", bookings: 10 },
    { day: "Thu", bookings: 16 },
    { day: "Fri", bookings: 5 },
    { day: "Sat", bookings: 12 },
    { day: "Sun", bookings: 3 },
  ];

  const maxBookings = Math.max(...dayData.map(d => d.bookings));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Bookings by day of week</h3>

      {/* Bar Chart */}
      <div className="relative w-full" style={{ height: '192px' }}>
        {/* Y-axis */}
        <div className="absolute left-0 top-0 flex flex-col justify-between text-xs text-gray-500" style={{ height: 'calc(100% - 24px)' }}>
          <span>20</span>
          <span>15</span>
          <span>10</span>
          <span>5</span>
          <span>0</span>
        </div>

        {/* Bars */}
        <div className="ml-8 flex items-end justify-between gap-2" style={{ height: 'calc(100% - 24px)' }}>
          {dayData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center h-full justify-end">
              <div
                className="w-full rounded-t transition-all hover:opacity-80"
                style={{ 
                  height: `${(data.bookings / maxBookings) * 100}%`,
                  backgroundColor: '#3B82F6',
                  minHeight: '4px'
                }}
              ></div>
              <span className="text-xs text-gray-600 mt-2 absolute" style={{ bottom: '-24px' }}>{data.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
