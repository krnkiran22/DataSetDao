'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DatasetCard } from './DatasetCard';
import { mockDatasets } from '@/lib/mockData/datasets';

interface DatasetGridProps {
  filters: {
    search: string;
    qualityRange: [number, number];
    priceRange: [number, number];
    categories: string[];
    dataSize: string;
    verification: string[];
  };
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export function DatasetGrid({ filters, sortBy, setSortBy }: DatasetGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const datasetsPerPage = 9;

  const filteredDatasets = useMemo(() => {
    let filtered = [...mockDatasets];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(searchLower) ||
        d.description.toLowerCase().includes(searchLower) ||
        d.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Quality range filter
    filtered = filtered.filter(d =>
      d.qualityScore >= filters.qualityRange[0] &&
      d.qualityScore <= filters.qualityRange[1]
    );

    // Price range filter
    filtered = filtered.filter(d =>
      d.price >= filters.priceRange[0] &&
      d.price <= filters.priceRange[1]
    );

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(d =>
        filters.categories.includes(d.category)
      );
    }

    // Verification filter
    if (filters.verification.length > 0) {
      filtered = filtered.filter(d => {
        if (filters.verification.includes('ai') && !d.verified) return false;
        if (filters.verification.includes('blockchain') && !d.blockchainCertified) return false;
        if (filters.verification.includes('training') && !d.trainingVerified) return false;
        return true;
      });
    }

    // Sort
    switch (sortBy) {
      case 'quality-high':
        filtered.sort((a, b) => b.qualityScore - a.qualityScore);
        break;
      case 'quality-low':
        filtered.sort((a, b) => a.qualityScore - b.qualityScore);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'recent':
        filtered.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
        break;
      default:
        // relevance - keep original order
        break;
    }

    return filtered;
  }, [filters, sortBy]);

  const totalPages = Math.ceil(filteredDatasets.length / datasetsPerPage);
  const startIndex = (currentPage - 1) * datasetsPerPage;
  const paginatedDatasets = filteredDatasets.slice(startIndex, startIndex + datasetsPerPage);

  return (
    <div>
      {/* Sort Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-8 pb-4 border-b border-border-subtle"
      >
        <div>
          <p className="text-foreground-secondary">
            Showing <span className="font-semibold text-foreground-primary">{filteredDatasets.length}</span> datasets
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-foreground-secondary">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-background-elevated border border-border-DEFAULT rounded-lg px-4 py-2 text-sm text-foreground-primary focus:border-accent-pink focus:outline-none focus:ring-2 focus:ring-accent-pink/20 transition-all cursor-pointer"
          >
            <option value="relevance">Relevance</option>
            <option value="quality-high">Quality (High to Low)</option>
            <option value="quality-low">Quality (Low to High)</option>
            <option value="price-low">Price (Low to High)</option>
            <option value="price-high">Price (High to Low)</option>
            <option value="recent">Most Recent</option>
          </select>
        </div>
      </motion.div>

      {/* Dataset Grid */}
      {paginatedDatasets.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedDatasets.map((dataset, index) => (
              <DatasetCard key={dataset.id} dataset={dataset} index={index} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex items-center justify-center gap-2 mt-16"
            >
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-background-elevated border border-border-DEFAULT rounded-lg text-foreground-primary disabled:opacity-50 disabled:cursor-not-allowed hover:border-accent-pink transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>

              {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                let pageNum: number;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (currentPage <= 4) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = currentPage - 3 + i;
                }

                if (i === 0 && pageNum > 1) {
                  return (
                    <div key="start-ellipsis" className="px-2 text-foreground-tertiary">...</div>
                  );
                }
                if (i === 6 && pageNum < totalPages) {
                  return (
                    <div key="end-ellipsis" className="px-2 text-foreground-tertiary">...</div>
                  );
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${
                      currentPage === pageNum
                        ? 'bg-accent-pink text-white shadow-glow-pink'
                        : 'bg-background-elevated border border-border-DEFAULT text-foreground-secondary hover:border-accent-pink hover:text-accent-pink'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-background-elevated border border-border-DEFAULT rounded-lg text-foreground-primary disabled:opacity-50 disabled:cursor-not-allowed hover:border-accent-pink transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </motion.div>
          )}
        </>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center py-24"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground-tertiary mb-6">
            <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>
            <circle cx="12" cy="13" r="2"/>
            <path d="M12 15v5"/>
          </svg>
          <h3 className="font-display text-3xl font-semibold text-foreground-primary mb-2">
            No datasets found
          </h3>
          <p className="text-lg text-foreground-secondary mb-8 max-w-md text-center">
            Try adjusting your filters or search terms to find what you're looking for
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-accent-pink text-white rounded-full font-semibold hover:bg-accent-magenta hover:shadow-glow-pink transition-all duration-200"
          >
            Clear All Filters
          </button>
        </motion.div>
      )}
    </div>
  );
}
