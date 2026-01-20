import ChatBox from "@/components/chat/ChatBox";
import Header from "@/components/Header";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-col w-full">
          <Header />
          <ChatBox />
        </div>
      </SidebarProvider>
    </div>
  );
}
