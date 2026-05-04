import DashboardLayout from "../../../components/layouts/DashboardLayout";
import ChatView from "../../../components/shared/ChatView";

export default function ChatPage() {
  return (
    <DashboardLayout>
      <ChatView
        emptyStateText="Choose a conversation from the list to start messaging with your service providers."
      />
    </DashboardLayout>
  );
}
