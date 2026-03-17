import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ContactSection from "../../../components/dashboard/ContactSection";
import ChatBotDrawer from "../../../components/dashboard/ChatBoxDrawer";
import ChatBotUI from "../../../components/dashboard/ChatBotUI";
import DashboardLayout from "../../../components/layouts/DashboardLayout";

export default function ContactPage() {
  const [open, setOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-9">
        <ContactSection openChat={() => setOpen(true)} />

        <ChatBotDrawer isOpen={open} onClose={() => setOpen(false)}>
          {open && <ChatBotUI userType="user" bookingId={bookingId} />}
        </ChatBotDrawer>
      </div>
    </DashboardLayout>
  );
}
