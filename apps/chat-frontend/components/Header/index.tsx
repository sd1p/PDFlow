"use client";
import { UserButton } from "@clerk/nextjs";
import ThemeToggle from "./ThemeToggle";
import { SidebarTrigger } from "../ui/sidebar";

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-100 dark:bg-background border-b dark:border-gray-800">
      <SidebarTrigger />
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        ChatApp
      </h1>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-10 h-10"
            }
          }}
        />
      </div>
    </header>
  );
};

export default Header;
