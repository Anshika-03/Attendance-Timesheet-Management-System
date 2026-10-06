import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

type Props = {
  children: ReactNode
}

function AppLayout({
  children
}: Props) {
  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar />

      <div className="ml-64 flex-1 flex flex-col">
        <Navbar />

        <main className="p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppLayout
