import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ShoppingBag, Search, Menu, X, Sprout, ArrowRight } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/utils/currency'

export const Header: React.FC = () => {
  const { summary, openCart } = useCart()
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsMobileMenuOpen(false)
    } else {
      navigate('/shop')
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* Top Value Proposition Banner */}
      <div className="bg-[#1B4332] text-emerald-100 text-[11px] sm:text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span>🌱 100% Certified Organic Harvests • Free delivery across India on orders over ₹999</span>
        <Link to="/shop" className="underline hover:text-white hidden md:inline-flex items-center gap-0.5">
          Shop Fresh <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-4">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-200/60 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-[#1B4332] text-amber-400 flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <Sprout className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-stone-900 font-display leading-tight">
                Harvest <span className="text-[#1B4332]">&</span> Hearth
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-amber-700 -mt-1 hidden sm:block">
                Pure Artisanal Foods
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-700">
            <Link to="/" className="hover:text-[#1B4332] transition-colors">
              Home
            </Link>
            <Link to="/shop" className="hover:text-[#1B4332] transition-colors">
              Pantry Catalog
            </Link>
            <Link to="/shop?category=cat_oils" className="hover:text-[#1B4332] transition-colors">
              Oils & Ghee
            </Link>
            <Link to="/shop?category=cat_honey" className="hover:text-[#1B4332] transition-colors">
              Wild Honey
            </Link>
            <Link to="/shop?category=cat_spices" className="hover:text-[#1B4332] transition-colors">
              Spices
            </Link>
          </nav>

          {/* Search Bar & Cart Action */}
          <div className="flex items-center gap-3">
            {/* Desktop Quick Search */}
            <form onSubmit={handleSearchSubmit} className="relative hidden lg:block w-64">
              <input
                type="text"
                placeholder="Search turmeric, ghee, honey..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-stone-300 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332] transition-all"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </form>

            {/* Cart Trigger Button */}
            <button
              type="button"
              onClick={openCart}
              aria-label={`View cart with ${summary.itemCount} items`}
              className="relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200/90 hover:border-stone-300 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-[#1B4332] transition-transform group-hover:scale-110" />
                {summary.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-amber-600 text-white text-[11px] font-bold flex items-center justify-center animate-in zoom-in-75">
                    {summary.itemCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-[10px] text-stone-400 font-semibold uppercase">Basket</span>
                <span className="text-xs font-bold text-stone-800">
                  {formatCurrency(summary.subtotal)}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="lg:hidden pb-3 pt-1">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search organic pantry foods..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 focus:border-[#1B4332]"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-5 py-4 space-y-3 animate-in slide-in-from-top-3">
          <nav className="flex flex-col gap-2 font-medium text-stone-800">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-stone-50"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-stone-50 font-semibold text-[#1B4332]"
            >
              Full Pantry Catalog
            </Link>
            <Link
              to="/shop?category=cat_oils"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-stone-50 text-stone-600"
            >
              Artisanal Oils & Ghee
            </Link>
            <Link
              to="/shop?category=cat_honey"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-stone-50 text-stone-600"
            >
              Wild Himalayan Honey
            </Link>
            <Link
              to="/shop?category=cat_spices"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-stone-50 text-stone-600"
            >
              Single-Origin Spices
            </Link>
            <Link
              to="/shop?category=cat_grains"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-stone-50 text-stone-600"
            >
              Heritage Grains
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
