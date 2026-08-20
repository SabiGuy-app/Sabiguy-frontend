export function EditButton({ onClick, children = "Edit" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border border-[#CFCBCC] px-3.5 py-1.5 text-sm font-medium text-[#3D393A] hover:bg-gray-50"
    >
      {children}
    </button>
  );
}

export default function SettingsCard({ title, subtitle, onEdit, headerRight, children }) {
  return (
    <div className="border-b border-[#E8E5E6] px-5 py-5 last:border-b-0 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-[#231F20]">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-[#918E8F]">{subtitle}</p>}
        </div>
        {headerRight ?? (onEdit && <EditButton onClick={onEdit} />)}
      </div>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

export function SettingsRow({ label, value, valueNode, note }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm text-[#656263]">{label}</p>
        {note && <p className="mt-0.5 text-xs text-[#918E8F]">{note}</p>}
      </div>
      {valueNode ?? <p className="text-sm font-semibold text-[#231F20]">{value}</p>}
    </div>
  );
}
