import { useState } from "react";

export default function ServicesCard({ title, onClick, image, imageIncludesTitle = false, tasks = [], onTaskClick }) {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md">
      <button type="button" onClick={onClick} aria-label={`Explore ${title}`}
        className="relative block aspect-[401/229] w-full overflow-hidden bg-[#F5F8F6] focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#005823]">
        {!imageFailed && <img src={image} alt={imageIncludesTitle ? title : ""} loading="lazy" onError={() => setImageFailed(true)}
          className={`h-full w-full ${imageIncludesTitle || image.endsWith(".jpg") ? "object-cover" : "object-contain p-8"}`} />}
        {(!imageIncludesTitle || imageFailed) && <><div className="absolute inset-0 bg-black/45" /><h3 className="absolute inset-0 flex items-center justify-center px-5 text-center text-xl font-bold leading-snug text-white lg:text-2xl">{title}</h3></>}
      </button>
      <div className="min-h-[152px] px-4 pb-5 pt-3">
        <h4 className="mb-3 border-b border-gray-200 pb-2 text-sm font-medium text-[#231F20]">Featured Tasks</h4>
        <ul className="space-y-1.5 text-sm text-[#231F20BF]">
          {tasks.map((task) => <li key={task}><button type="button" onClick={() => onTaskClick ? onTaskClick(task) : onClick?.()}
            className="text-left hover:text-[#005823] focus-visible:outline-2 focus-visible:outline-[#005823]">{task}</button></li>)}
        </ul>
      </div>
    </article>
  );
}
