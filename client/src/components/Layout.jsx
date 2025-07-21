import { Outlet } from "react-router-dom"
import { useState } from 'react'
import Sidebar from './SideBar'
import TopBar from './TopBar'

export default function Layout({ children }) {
  // Desktop sidebar state (collapsed/expanded)
  const [isCollapsed, setIsCollapsed] = useState(false)
  // Mobile sidebar state (open/closed)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Desktop toggle function
  const toggleDesktop = () => setIsCollapsed(!isCollapsed)

  // Mobile toggle function
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar - handles both desktop and mobile */}
      <Sidebar 
        isCollapsed={isCollapsed} 
        toggle={toggleDesktop}
        isMobileOpen={isMobileOpen}
        toggleMobile={toggleMobile}
      />

      {/* Main content area - full width on mobile when sidebar is closed */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar 
          isCollapsed={isCollapsed} 
          toggle={toggleDesktop}
          isMobileOpen={isMobileOpen}
          toggleMobile={toggleMobile}
        />
        
        {/* Main content with proper overflow handling */}
        <main className="flex-1 overflow-hidden bg-gray-100">
          <div className="h-full overflow-auto p-4">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile overlay for sidebar - only show when mobile sidebar is open */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobile}
        />
      )}
    </div>
  )
}