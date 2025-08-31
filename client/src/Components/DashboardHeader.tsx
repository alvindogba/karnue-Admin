import { Bell, MessageSquareMore, CircleUserRound } from "lucide-react";

export default function DashboardHeader() {
  return (
    <header className="flex h-14 items-center justify-between bg-black px-5 text-white">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold">Karnue</span>
        <span className="text-sm opacity-80">Admin</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1 opacity-90 hover:opacity-100 cursor-pointer">
          <Bell className="h-5 w-5" />
          <span className="text-sm">Notifications</span>
        </div>
        <div className="flex items-center gap-1 opacity-90 hover:opacity-100 cursor-pointer">
          <MessageSquareMore className="h-5 w-5" />
          <span className="text-sm">Chats</span>
        </div>
        <div className="flex items-center gap-2">
          <CircleUserRound className="h-7 w-7" />
          <span className="text-sm">Account</span>
        </div>
      </div>
    </header>
  );
}
