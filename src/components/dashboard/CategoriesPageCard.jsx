export default function Card({ image, title, tasks = [], onTaskClick }) {
  return (
    <div className="max-w-fit mb-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">

      {/* Image */}
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover brightness-50 group-hover:brightness-100 transition-all duration-300"
        />
        <h3 className="absolute inset-0 flex items-center justify-center text-white text-2xl font-semibold">
          {title}
        </h3>
      </div>

      {/* Tasks */}
      <div className="p-4">
        <h4 className="font-semibold text-lg border-b border-gray-300 pb-1 mb-2">Featured Tasks</h4>

        <ul className="list-disc list-inside text-gray-600 space-y-1">
          {tasks.length > 0 ? (
            tasks.map((task, idx) => (
              <ul
                key={idx}
                className="cursor-pointer hover:text-[#005823]"
                onClick={() => onTaskClick(task)}
              >
                {task}
              </ul >
            ))
          ) : (
            <p className="text-gray-400 italic">No tasks available</p>
          )}
        </ul>
      </div>
    </div>
  );
}
