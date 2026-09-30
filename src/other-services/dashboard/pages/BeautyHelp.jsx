import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ChatBotDrawer from "../../../components/dashboard/ChatBoxDrawer";
import ChatBotUI from "../../../components/dashboard/ChatBotUI";
import BeautyDashboardLayout from "../layout/BeautyDashboardLayout";
import BeautyContactSection from "../components/ContactSection";

export default function BeautyContactPage() {
  const [open, setOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  return (
    <BeautyDashboardLayout>
      <div className="p-4 sm:p-9">
        <BeautyContactSection openChat={() => setOpen(true)} />

        <ChatBotDrawer isOpen={open} onClose={() => setOpen(false)}>
          {open && <ChatBotUI userType="user" bookingId={bookingId} />}
        </ChatBotDrawer>
      </div>
    </BeautyDashboardLayout>
  );
}
