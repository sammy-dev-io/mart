import { useState } from 'react'
import AppSidebar from '../../components/AppSidebar'

function AccountLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>

      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} alwaysVisibleDesktop={true} />

      {/* Mobile top bar */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 h-14 z-30 flex items-center justify-between px-4"
        style={{ background: 'var(--primary)' }}
      >
        <span className="font-black text-white">MART Account</span>
        <button onClick={() => setSidebarOpen(true)} className="text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <main className="flex-1 md:ml-64 min-h-screen pt-14 md:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AccountLayout