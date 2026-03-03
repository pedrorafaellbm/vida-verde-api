import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { Header } from './Header'

export default function Layout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-content">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}
