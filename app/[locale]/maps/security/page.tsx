import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import SecurityMap from "@/components/maps/SecurityMap";

export default function SecurityMapPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 min-w-0 p-6">
          <SecurityMap />
        </main>
      </div>
    </div>
  );
}
