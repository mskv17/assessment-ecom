import React from 'react'
import { Link } from 'react-router-dom'
import { Sprout, ArrowRight, Search } from 'lucide-react'
import { Button } from '@/components/common/Button'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-[#FAF8F5] border border-stone-200 shadow-inner flex items-center justify-center mx-auto text-amber-700">
          <Sprout className="w-10 h-10" />
        </div>

        <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#1B4332] bg-[#1B4332]/10 px-3 py-1 rounded-full border border-[#1B4332]/20">
          404 • Page Not Found
        </span>

        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 font-display">
          This Path Has Gone Wild
        </h1>

        <p className="text-sm text-stone-600 leading-relaxed max-w-sm mx-auto">
          The page or artisanal item you are looking for does not exist in our pantry, or has returned to nature.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/shop" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              fullWidth
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Explore Fresh Pantry
            </Button>
          </Link>

          <Link to="/" className="w-full sm:w-auto">
            <Button variant="outline" size="md" fullWidth>
              Return Home
            </Button>
          </Link>
        </div>

        <div className="pt-8 border-t border-stone-200/60">
          <p className="text-xs text-stone-400">
            Looking for something specific? Search our oils, wild honeys, and spices from the header search bar above.
          </p>
        </div>
      </div>
    </div>
  )
}
