import Header from "@/app/components/header";
import ChatSection from "./components/chat-section";
import './page.css';
import DocumentManager from "./components/ui/chat/document-manager";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-10 p-6 bg-primary">
      <div className="w-full max-w-8xl p-8 bg-foreground shadow-lg rounded-lg">
        <Header />
      </div>
      <div className="w-full max-w-8xl p-8 bg-foreground shadow-lg rounded-lg">
        <ChatSection />
      </div>
      <div className="w-full max-w-8xl p-8 bg-foreground shadow-lg rounded-lg">
        <DocumentManager />
      </div>
    </main>
  );
}
