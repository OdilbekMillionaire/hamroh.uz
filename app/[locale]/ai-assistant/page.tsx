import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import ChatWindow from "@/components/ai/ChatWindow";

export default function AIAssistantPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 min-w-0 flex flex-col">
          <ChatWindow />
        </main>
      </div>
    </div>
  );
}
