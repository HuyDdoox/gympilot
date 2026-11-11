import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MemberHeader } from './MemberHeader';
import { MemberFooter } from './MemberFooter';

export const AppLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const isMemberArea = location.pathname === '/' || location.pathname.startsWith('/member');

  // Member Consumer Portal Layout: Top Horizontal Navigation + Full-width Content + Dark Navy Footer
  if (isMemberArea) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
        <MemberHeader />
        <main className="flex-1 w-full">
          <Outlet />
        </main>
        <MemberFooter />
      </div>
    );
  }

  // Admin / Management Layout: Dark Shell with Sidebar, Header & Content Area
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header onToggleSidebar={() => setIsMobileSidebarOpen(true)} />

      {/* Main Container with Sidebar & Content */}
      <div className="flex flex-1 w-full max-w-[1600px] mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        {/* Dynamic Page Outlet Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
