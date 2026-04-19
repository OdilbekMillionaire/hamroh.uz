import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import TranslatorTabs from "@/components/translator/TranslatorTabs";

export default function TranslatorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 min-w-0 p-6">
          <TranslatorTabs />
        </main>
      </div>
      <Footer />
    </div>
  );
}
