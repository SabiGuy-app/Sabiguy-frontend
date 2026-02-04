import React, { useState } from "react";
import ProviderDashboardLayout from "../../../components/layouts/ProviderDashboardLayout";
import ContactSection from "../../../components/dashboard/ContactSection";
import ChatBotDrawer from "../../../components/dashboard/ChatBoxDrawer";
import ChatBotUI from "../../../components/dashboard/ChatBotUI";

const ProviderHelp = () => {
  const [open, setOpen] = useState(false);
  return (
    <ProviderDashboardLayout>
      <div className="p-9">
        <ContactSection openChat={() => setOpen(true)} />

        <ChatBotDrawer isOpen={open} onClose={() => setOpen(false)}>
          <ChatBotUI />
        </ChatBotDrawer>
      </div>
    </ProviderDashboardLayout>
  );
};

export default ProviderHelp;
