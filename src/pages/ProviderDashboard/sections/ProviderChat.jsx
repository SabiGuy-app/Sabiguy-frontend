import ProviderDashboardLayout from "../../../components/layouts/ProviderDashboardLayout";
import ChatView from "../../../components/shared/ChatView";

const ProviderChat = () => {
  return (
    <ProviderDashboardLayout>
      <ChatView
        emptyStateText="Choose a conversation from the list to start messaging with your customers."
      />
    </ProviderDashboardLayout>
  );
};

export default ProviderChat;
