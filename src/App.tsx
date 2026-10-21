import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { ToastProvider } from '@/context/ToastContext'
import { CartProvider } from '@/context/CartContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { AppRoutes } from '@/routes/AppRoutes'
import { ScrollToTop } from '@/components/common/ScrollToTop'

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <CartProvider>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-800">
              <Header />
              <main className="flex-1">
                <AppRoutes />
              </main>
              <CartDrawer />
              <Footer />
            </div>
          </CartProvider>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
