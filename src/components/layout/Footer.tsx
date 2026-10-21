import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sprout, ShieldCheck, Truck, RefreshCw, Mail, CheckCircle } from 'lucide-react'
import { Button } from '@/components/common/Button'

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [newsletterError, setNewsletterError] = useState('')

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
      setNewsletterError('Please enter a valid email address')
      return
    }

    setNewsletterError('')
    setIsSubscribed(true)
  }

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Value Badges (Spec Section 6) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-stone-800">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-stone-800/40 border border-stone-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Certified Organic</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Directly sourced from indigenous smallholder farms adhering to Vedic regenerative farming practices.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-stone-800/40 border border-stone-800">
            <div className="w-12 h-12 rounded-xl bg-amber-950 text-amber-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Fresh Harvest Courier</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Complimentary tracked dispatch across India on orders above ₹999. Micro-batch packed in glass and tin.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-stone-800/40 border border-stone-800">
            <div className="w-12 h-12 rounded-xl bg-stone-800 text-stone-300 flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Purity Guarantee</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Hassle-free replacement for any damaged containers or quality concerns within 7 days of delivery.
              </p>
            </div>
          </div>
        </div>

        {/* Links & Brand Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12 border-b border-stone-800 text-sm">
          {/* Brand Story */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#1B4332] text-amber-400 flex items-center justify-center">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-white font-display">
                Harvest & Hearth
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              We celebrate India&apos;s rich agricultural biodiversity by bringing unadulterated, cold-pressed oils, single-origin spices, raw mountain honeys, and heritage grains directly from farm soils to your hearth.
            </p>
            <div className="inline-block p-3 rounded-xl bg-stone-800/60 border border-stone-700/60 text-xs text-amber-400/90">
              <span className="font-semibold text-white">Assessment Project Notice:</span> This application runs frontend-only on decoupled mock data through service contracts.
            </div>
          </div>

          {/* Catalog Links */}
          <div>
            <h5 className="font-semibold text-white uppercase text-xs tracking-wider mb-4">
              Pantry Categories
            </h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link to="/shop?category=cat_oils" className="hover:text-amber-400 transition-colors">
                  Artisanal Oils & Ghee
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cat_honey" className="hover:text-amber-400 transition-colors">
                  Wild Forest Honey
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cat_spices" className="hover:text-amber-400 transition-colors">
                  Single-Origin Spices
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cat_grains" className="hover:text-amber-400 transition-colors">
                  Heritage Grains & Millets
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cat_nuts" className="hover:text-amber-400 transition-colors">
                  Dry Fruits & Seeds
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cat_beverages" className="hover:text-amber-400 transition-colors">
                  Handcrafted Teas
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h5 className="font-semibold text-white uppercase text-xs tracking-wider mb-4">
              Customer Care
            </h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link to="/shop" className="hover:text-amber-400 transition-colors">
                  Track Delivery
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-amber-400 transition-colors">
                  Shipping & Returns Policy
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-amber-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <span className="text-stone-300">care@harvesthearth.com</span>
              </li>
              <li>
                <span className="text-stone-300">+91 (080) 4123-8890</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="font-semibold text-white uppercase text-xs tracking-wider mb-4">
              Harvest Updates
            </h5>
            <p className="text-xs text-stone-400 mb-3 leading-relaxed">
              Receive seasonal harvest notices and artisan grower profiles.
            </p>
            {isSubscribed ? (
              <div className="flex items-center gap-2 p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-xs text-emerald-300">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Subscribed! Check your inbox for fresh harvest news.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={newsletterEmail}
                    onChange={e => setNewsletterEmail(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 text-xs rounded-xl bg-stone-800 border border-stone-700 text-white placeholder:text-stone-500 focus:outline-none focus:border-emerald-500"
                  />
                  <Mail className="w-4 h-4 text-stone-500 absolute right-3 top-3 pointer-events-none" />
                </div>
                {newsletterError && (
                  <p className="text-[11px] text-rose-400">{newsletterError}</p>
                )}
                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  fullWidth
                >
                  Join Farm Circle
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Harvest & Hearth Foods Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-stone-300 transition-colors">Privacy Policy</span>
            <span className="hover:text-stone-300 transition-colors">Terms of Service</span>
            <span className="hover:text-stone-300 transition-colors">FSSAI License #10022043000192</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
