"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { authApi } from "@/app/_lib/api";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Settings,
  CreditCard,
  LogOut,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pricing", label: "Pricing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {}
    router.push("/login");
  };

  const NavContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full ${mobile ? "p-4" : ""}`}>
      <div className={`flex items-center gap-2 mb-8 ${mobile ? "px-2" : ""}`}>
        <Sparkles className="w-6 h-6 text-blue-600" />
        <span className="text-lg font-semibold text-gray-900">Luminos</span>
        {mobile && (
          <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => mobile && setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 flex-col">
        <div className="p-6">
          <NavContent />
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 z-40">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <NavContent mobile />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2 mx-auto">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-gray-900">Luminos</span>
        </div>
        <div className="w-10" />
      </header>

      {/* Main Content */}
      <main className="md:ml-64 pt-14 md:pt-0 min-h-screen">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}