
export default function PeakHourAnalysis() {
  const hourData = [
    { time: "9-12", bookings: 12 },
    { time: "3-6", bookings: 18 },
    { time: "6-9", bookings: 15 },
    { time: "9-12 AM", bookings: 8 },
    { time: "12-3", bookings: 4 },
  ];

  const maxBookings = Math.max(...hourData.map(d => d.bookings));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Peak hour Analysis</h3>
      <p className="text-sm text-gray-500 mb-6">Understand when you get the most bookings</p>

      {/* Bar Chart */}
      <div className="relative w-full" style={{ height: '192px' }}>
        {/* Y-axis */}
        <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-gray-500" style={{ height: 'calc(100% - 24px)'}}>
          <span>20</span>
          <span>15</span>
          <span>10</span>
          <span>5</span>
          <span>0</span>
        </div>

        {/* Bars */}
        <div className="ml-8 flex items-end justify-between gap-2" style={{ height: 'calc(100% - 24px)'}}>
          {hourData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center h-full justify-end">
              <div
                className="w-full rounded-t transition-all hover:opacity-80"
                style={{ height: `${(data.bookings / maxBookings) * 100}%`,
                backgroundColor: '#8BC53F',
                minHeight: '4px'
               }}
              ></div>
              <span className="text-xs text-gray-600 mt-2 absolute" style={{ bottom: '-24px' }}>{data.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}