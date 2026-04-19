import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import PetitionForm from "@/components/petitions/PetitionForm";

export default function NewPetitionPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 min-w-0 p-6">
          <PetitionForm />
        </main>
      </div>
      <Footer />
    </div>
  );
}
