export default function BookingsByDayOfWeek({ data }) {
  const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Build 7-day array from API data — fill missing days with 0
  const raw = Array.isArray(data) ? data : [];

  const dayData = ALL_DAYS.map((day) => {
    const found = raw.find((d) =>
      (d.day || "").toLowerCase().startsWith(day.toLowerCase())
    );
    return { day, bookings: found?.bookings ?? found?.count ?? 0 };
  });

  const maxBookings = Math.max(...dayData.map((d) => d.bookings), 1);

  // Dynamic y-axis — rounded to nearest 5
  const yMax = Math.ceil(maxBookings / 5) * 5 || 20;
  const yLabels = [yMax, Math.round(yMax * 0.75), Math.round(yMax * 0.5), Math.round(yMax * 0.25), 0];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Bookings by day of week</h3>

      {/* Bar Chart — UI identical to original */}
      <div className="relative w-full" style={{ height: '192px' }}>
        {/* Y-axis */}
        <div className="absolute left-0 top-0 flex flex-col justify-between text-xs text-gray-500" style={{ height: 'calc(100% - 24px)' }}>
          {yLabels.map((v, i) => <span key={i}>{v}</span>)}
        </div>

        {/* Bars */}
        <div className="ml-8 flex items-end justify-between gap-2" style={{ height: 'calc(100% - 24px)' }}>
          {dayData.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center h-full justify-end">
              <div
                className="w-full rounded-t transition-all hover:opacity-80"
                style={{
                  height: `${(item.bookings / maxBookings) * 100}%`,
                  backgroundColor: '#3B82F6',
                  minHeight: '4px'
                }}
              ></div>
              <span className="text-xs text-gray-600 mt-2 absolute" style={{ bottom: '-24px' }}>{item.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
