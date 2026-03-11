export default function ActivityCard({ title, figure, icon }) {
  const isLoading = figure === "...";

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-400 text-sm">{title}</h3>
        {icon && (
          <span className="bg-gray-50 rounded-md p-1.5">{icon}</span>
        )}
      </div>
      {isLoading ? (
        <div className="h-10 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
      ) : (
        <p className="text-4xl text-black font-semibold">{figure}</p>
      )}
    </div>
  );
}
