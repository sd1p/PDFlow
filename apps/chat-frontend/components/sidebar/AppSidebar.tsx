"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { useChat } from "@/context/ChatContext";
import { ScrollArea } from "../ui/scroll-area";

export function AppSidebar() {
  const [chats, setChats] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const storedChats = localStorage.getItem("chats");
      return storedChats ? JSON.parse(storedChats) : ["Chat 1"];
    }
    return ["Chat 1"];
  });

  const { selectedChat, setSelectedChat } = useChat();

  const handleSelectChat = (index: number) => {
    setSelectedChat(index);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("chats", JSON.stringify(chats));
    }
  }, [chats]);

  const addChat = () => {
    const newChat = `Chat ${chats.length + 1}`;
    setChats([...chats, newChat]);
  };

  return (
    <Sidebar className="bg-gray-100 dark:bg-gray-900">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <div className="flex items-center justify-between w-full py-4">
              <p className="text-xl">Chats</p>
              <div className="md:hidden">
                <SidebarTrigger />
              </div>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex justify-center">
              <button
                onClick={addChat}
                className="flex items-center justify-center w-11/12 p-2 my-4 bg-gray-200 dark:bg-gray-800 rounded-xl"
              >
                Add Chat
              </button>
            </div>
            <SidebarMenu className="h-[82vh] overflow-y-auto">
              <ScrollArea>
                {chats.map((chat: string, index: number) => (
                  <SidebarMenuItem
                    key={index}
                    className="px-2 pb-1 "
                    onClick={() => handleSelectChat(index)}
                  >
                    <SidebarMenuButton asChild>
                      <div
                        className={`flex items-center justify-start w-full p-4 rounded-xl ${
                          selectedChat === index
                            ? "bg-gray-300 dark:bg-gray-800 "
                            : ""
                        }`}
                      >
                        <span className="text-center pl-5">{chat}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </ScrollArea>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
