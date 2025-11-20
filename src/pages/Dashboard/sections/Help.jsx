import { useState } from "react";
import ContactSection from "../../../components/dashboard/ContactSection";
import ChatBotDrawer from "../../../components/dashboard/ChatBoxDrawer";
import ChatBotUI from "../../../components/dashboard/ChatBotUI";
import DashboardLayout from "../../../components/layouts/DashboardLayout";


export default function ContactPage() {
  const [open, setOpen] = useState(false);

  return (
    <DashboardLayout>
        <div className="p-9">
      <ContactSection openChat={() => setOpen(true)} />


      <ChatBotDrawer isOpen={open} onClose={() => setOpen(false)}>
        <ChatBotUI />
      </ChatBotDrawer>
      </div>
    </DashboardLayout>
  );
}
