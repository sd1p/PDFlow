import ChatBox from "@/components/ChatBox";
import Header from "@/components/Header";
import InputBox from "@/components/InputBox";

export default function Home() {
  return (
    <>
      <div className="h-screen">
        <Header />
        <ChatBox />
        <InputBox />
      </div>
    </>
  );
}
