'use client';

import { useState } from 'react';
import { FilterSidebar } from '@/components/features/marketplace/FilterSidebar';
import { DatasetGrid } from '@/components/features/marketplace/DatasetGrid';
import { motion } from 'framer-motion';

export default function MarketplacePage() {
  const [filters, setFilters] = useState({
    search: '',
    qualityRange: [0, 100] as [number, number],
    priceRange: [0, 10000] as [number, number],
    categories: [] as string[],
    dataSize: '' as string,
    verification: [] as string[],
  });

  const [sortBy, setSortBy] = useState('relevance');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <>
      <main className="min-h-screen bg-background-base pt-24">
        <div className="container-center py-12">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="font-display text-5xl font-bold text-foreground-primary mb-4">
              Dataset Marketplace
            </h1>
            <p className="text-xl text-foreground-secondary">
              Discover high-quality, AI-verified datasets for your projects
            </p>
          </motion.div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden mb-6 w-full bg-background-elevated border border-border-DEFAULT rounded-xl px-6 py-4 flex items-center justify-between text-foreground-primary hover:border-accent-pink/40 transition-colors"
          >
            <span className="font-semibold">Filters</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`}>
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filter Sidebar */}
            <aside className={`lg:w-64 flex-shrink-0 ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
              <FilterSidebar filters={filters} setFilters={setFilters} />
            </aside>

            {/* Dataset Grid */}
            <div className="flex-1 min-w-0">
              <DatasetGrid filters={filters} sortBy={sortBy} setSortBy={setSortBy} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
