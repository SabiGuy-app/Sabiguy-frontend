import { useMemo, useState } from "react";
import { CheckCircle2, Plus } from "lucide-react";
import FleetDashboardLayout from "../layout/FleetDashboardLayout";
import DocumentSummaryCards from "../components/DocumentSummaryCards";
import DocumentsList from "../components/DocumentsList";
import DocumentModal from "../components/DocumentModal";
import { mockDocuments } from "../data/mockDocuments";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "needs-action", label: "Needs Action" },
  { key: "driver", label: "Driver" },
  { key: "vehicle", label: "Vehicle" },
  { key: "business", label: "Business" },
];

const categoryLabel = (category) => {
  const value = typeof category === "string" && category ? category : "business";
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
};

export default function Documents() {
  const [documents, setDocuments] = useState(mockDocuments);
  const [activeFilter, setActiveFilter] = useState("all");
  const [modalDocument, setModalDocument] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const counts = useMemo(
    () => Object.fromEntries(["active", "expiring", "expired", "review"].map((status) => [status, documents.filter((document) => document.status === status).length])),
    [documents],
  );
  const needsActionCount = counts.expiring + counts.expired + counts.review;
  const compliance = documents.length
    ? Math.round(((counts.active / documents.length) * 100) / 10) * 10
    : 0;

  const visibleDocuments = useMemo(() => {
    if (activeFilter === "all") return documents;
    if (activeFilter === "needs-action") return documents.filter((document) => document.status !== "active");
    return documents.filter((document) => document.category === activeFilter);
  }, [activeFilter, documents]);

  const openAddModal = () => {
    setModalDocument(null);
    setModalOpen(true);
  };

  const saveDocument = (form, existingDocument) => {
    if (existingDocument) {
      setDocuments((current) => current.map((document) => document.id === existingDocument.id ? { ...document, ...form, detail: `${categoryLabel(form.category)} document · in review`, status: "review" } : document));
      setSuccessMessage("Document renewal submitted for review.");
    } else {
      setDocuments((current) => [{ id: `doc-${Date.now()}`, ...form, detail: `${categoryLabel(form.category)} document · in review`, status: "review" }, ...current]);
      setSuccessMessage("Document added successfully and sent for review.");
    }
    setModalOpen(false);
  };

  const approveDocument = (target) => {
    setDocuments((current) => current.map((document) => document.id === target.id ? { ...document, status: "active", detail: `${categoryLabel(document.category)} document · 365 days left` } : document));
    setSuccessMessage("Document approved successfully.");
  };

  return (
    <FleetDashboardLayout>
      <header className="mb-5 sm:mb-6">
        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[#231F20] sm:text-[26px]">Documents</h1>
        <p className="mt-2 text-sm text-[#656263] sm:text-base">{compliance}% compliant · renewing updates compliance live</p>
      </header>

      <DocumentSummaryCards counts={counts} />

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
          {FILTERS.map((filter) => {
            const count = filter.key === "all" ? documents.length : filter.key === "needs-action" ? needsActionCount : null;
            return (
              <button key={filter.key} type="button" onClick={() => setActiveFilter(filter.key)} className={`shrink-0 rounded-lg border px-4 py-2 text-sm ${activeFilter === filter.key ? "border-[#2F7D55] bg-[#2F7D55] text-white" : "border-[#CFCBCC] bg-white text-[#777374] hover:bg-gray-50"}`}>
                {filter.label}{count !== null ? ` (${count})` : ""}
              </button>
            );
          })}
        </div>
        <button type="button" onClick={openAddModal} className="inline-flex shrink-0 items-center justify-center gap-2 self-end rounded-md bg-[#2F7D55] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#256846] sm:self-auto"><Plus size={17} /> Add Document</button>
      </div>

      <div className="mt-4">
        <DocumentsList
          documents={visibleDocuments}
          onRenew={(document) => { setModalDocument(document); setModalOpen(true); }}
          onApprove={approveDocument}
        />
      </div>

      <DocumentModal isOpen={modalOpen} document={modalDocument} onClose={() => setModalOpen(false)} onSave={saveDocument} />

      {successMessage && (
        <button type="button" onClick={() => setSuccessMessage("")} className="fixed bottom-6 left-1/2 z-[90] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-start gap-3 rounded-xl bg-white px-4 py-4 text-left text-sm text-[#625E5F] shadow-[0_8px_30px_rgba(0,0,0,0.18)]">
          <CheckCircle2 size={20} className="shrink-0 text-[#2F7D55]" /> {successMessage}
        </button>
      )}
    </FleetDashboardLayout>
  );
}
