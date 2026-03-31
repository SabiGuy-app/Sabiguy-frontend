export default function PeakHourAnalysis({ data }) {
  // Map API buckets [{ hour, count }] into the 5 original time slots
  const slots = [
    { time: "9-12",    hours: [9,  10, 11] },
    { time: "3-6",     hours: [15, 16, 17] },
    { time: "6-9",     hours: [18, 19, 20] },
    { time: "9-12 AM", hours: [21, 22, 23] },
    { time: "12-3",    hours: [12, 13, 14] },
  ];

  const buckets = Array.isArray(data) ? data : [];

  const hourData = slots.map((slot) => ({
    time: slot.time,
    bookings: buckets
      .filter((b) => slot.hours.includes(b.hour ?? b.time))
      .reduce((sum, b) => sum + (b.bookings ?? b.count ?? 0), 0),
  }));

  const hasRealData = hourData.some((d) => d.bookings > 0);
  const displayData = hasRealData ? hourData : slots.map((s) => ({ time: s.time, bookings: 0 }));
  const maxBookings = Math.max(...displayData.map((d) => d.bookings), 1);

  // Dynamic y-axis — rounded to nearest 5
  const yMax = Math.ceil(maxBookings / 5) * 5 || 20;
  const yLabels = [yMax, Math.round(yMax * 0.75), Math.round(yMax * 0.5), Math.round(yMax * 0.25), 0];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Peak hour Analysis</h3>
      <p className="text-sm text-gray-500 mb-6">Understand when you get the most bookings</p>

      {/* Bar Chart — UI identical to original */}
      <div className="relative w-full" style={{ height: '192px' }}>
        {/* Y-axis */}
        <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-gray-500" style={{ height: 'calc(100% - 24px)'}}>
          {yLabels.map((v, i) => <span key={i}>{v}</span>)}
        </div>

        {/* Bars */}
        <div className="ml-8 flex items-end justify-between gap-2" style={{ height: 'calc(100% - 24px)'}}>
          {displayData.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center h-full justify-end">
              <div
                className="w-full rounded-t transition-all hover:opacity-80"
                style={{
                  height: `${(item.bookings / maxBookings) * 100}%`,
                  backgroundColor: '#8BC53F',
                  minHeight: '4px'
                }}
              ></div>
              <span className="text-xs text-gray-600 mt-2 absolute" style={{ bottom: '-24px' }}>{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
