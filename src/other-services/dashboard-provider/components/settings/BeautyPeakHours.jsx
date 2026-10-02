// Demo copy of the provider Peak Hour Analysis chart for the beauty dashboard.
const PEAK_DATA = [
  { time: "9-12", bookings: 10 },
  { time: "12-3", bookings: 15 },
  { time: "3-6", bookings: 11 },
  { time: "6-9", bookings: 12 },
  { time: "9-12 AM", bookings: 5 },
  { time: "12-3 AM", bookings: 2 },
];

export default function BeautyPeakHours() {
  const maxBookings = Math.max(...PEAK_DATA.map((d) => d.bookings), 1);
  const yMax = Math.ceil(maxBookings / 5) * 5 || 20;
  const yLabels = [
    yMax,
    Math.round(yMax * 0.75),
    Math.round(yMax * 0.5),
    Math.round(yMax * 0.25),
    0,
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Peak hour Analysis
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        Understand when you get the most bookings
      </p>

      <div className="relative w-full" style={{ height: "192px" }}>
        <div
          className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-gray-500"
          style={{ height: "calc(100% - 24px)" }}
        >
          {yLabels.map((v, i) => (
            <span key={i}>{v}</span>
          ))}
        </div>

        <div
          className="ml-8 flex items-end justify-between gap-2"
          style={{ height: "calc(100% - 24px)" }}
        >
          {PEAK_DATA.map((item, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center h-full justify-end relative"
            >
              <div
                className="w-full rounded-t transition-all hover:opacity-80"
                style={{
                  height: `${(item.bookings / maxBookings) * 100}%`,
                  backgroundColor: "#8BC53F",
                  minHeight: "4px",
                }}
              ></div>
              <span
                className="text-xs text-gray-600 mt-2 absolute"
                style={{ bottom: "-24px" }}
              >
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
