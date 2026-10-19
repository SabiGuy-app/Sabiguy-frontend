import { useEffect, useState } from "react";
import { X } from "lucide-react";

export function SettingsRow({ label, value, note, valueNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[10px] text-[#777777]">{label}</p>
        {note && <p className="mt-0.5 text-[9px] text-[#A1A1A1]">{note}</p>}
      </div>
      {valueNode ?? (
        <p className="text-right text-[10px] font-medium text-[#222222]">
          {value}
        </p>
      )}
    </div>
  );
}

export default function SettingsTabCard({
  title,
  onEdit,
  headerRight,
  children,
}) {
  return (
    <section className="mx-2 my-2 rounded-lg border border-[#E9E9E9] bg-white px-3 py-2.5 sm:mx-3 sm:px-3.5">
      <header className="flex items-center justify-between gap-3 border-b border-[#EEEEEE] pb-2">
        <h2 className="text-[11px] font-semibold text-[#242424]">{title}</h2>
        {headerRight ??
          (onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="rounded border border-[#D8E6DC] px-2 py-1 text-[10px] font-medium text-[#347B54] hover:bg-[#F3F8F4]"
            >
              Edit
            </button>
          ))}
      </header>
      <div className="space-y-2 py-2">{children}</div>
    </section>
  );
}

export function EditableSettingsSection({
  title,
  initialValues,
  fields,
  rows,
}) {
  const [values, setValues] = useState(initialValues);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <SettingsTabCard title={title} onEdit={() => setIsEditing(true)}>
        {rows.map(({ key, label, note }) => (
          <SettingsRow
            key={key}
            label={label}
            note={note}
            value={values[key]}
          />
        ))}
      </SettingsTabCard>
      <SettingsEditDialog
        isOpen={isEditing}
        title={`Edit ${title.toLowerCase()}`}
        fields={fields}
        values={values}
        onClose={() => setIsEditing(false)}
        onSave={(nextValues) => {
          setValues((current) => ({ ...current, ...nextValues }));
          setIsEditing(false);
        }}
      />
    </>
  );
}

export function SettingsEditDialog({
  isOpen,
  title,
  fields,
  values,
  onClose,
  onSave,
}) {
  const [draft, setDraft] = useState(values);

  useEffect(() => {
    if (isOpen) setDraft(values);
  }, [isOpen, values]);

  if (!isOpen) return null;

  const save = (event) => {
    event.preventDefault();
    onSave(draft);
  };

  return (
    <div
      className="fixed inset-0 z-80 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <form
        onSubmit={save}
        className="relative w-full max-w-md rounded-lg bg-white p-5 shadow-2xl sm:p-6"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close editor"
          className="absolute right-4 top-4 rounded p-1 text-[#777777] hover:bg-[#F3F3F3]"
        >
          <X size={18} aria-hidden="true" />
        </button>
        <h2 className="pr-8 text-base font-semibold text-[#242424]">{title}</h2>
        <div className="mt-5 space-y-3">
          {fields.map(({ key, label, type = "text", options }) => (
            <label
              key={key}
              className="block text-xs font-medium text-[#555555]"
            >
              {label}
              {type === "select" ? (
                <select
                  value={draft[key] ?? ""}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      [key]: event.target.value,
                    }))
                  }
                  className="mt-1.5 h-10 w-full rounded-md border border-[#D8D8D8] bg-white px-3 text-sm font-normal outline-none focus:border-[#347B54]"
                >
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  value={draft[key] ?? ""}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      [key]: event.target.value,
                    }))
                  }
                  className="mt-1.5 h-10 w-full rounded-md border border-[#D8D8D8] px-3 text-sm font-normal outline-none focus:border-[#347B54]"
                />
              )}
            </label>
          ))}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-md border border-[#D8D8D8] px-3 text-xs text-[#555555] hover:bg-[#F7F7F7]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-9 rounded-md bg-[#347B54] px-4 text-xs font-medium text-white hover:bg-[#286642]"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
