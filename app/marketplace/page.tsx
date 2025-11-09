'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, Star } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

// Mock data
const datasets = [
  {
    id: 1,
    title: "ImageNet-22K Subset",
    thumbnail: "/next.svg",
    seller: { name: "DataLabs Inc", reputation: 4.8 },
    qualityScore: 94,
    price: "$299",
    diversity: 92,
    accuracy: 96,
    bias: 91
  },
  {
    id: 2,
    title: "Financial Time Series 2024",
    thumbnail: "/next.svg",
    seller: { name: "FinanceAI", reputation: 4.9 },
    qualityScore: 89,
    price: "$549",
    diversity: 88,
    accuracy: 91,
    bias: 87
  },
  {
    id: 3,
    title: "Medical Records (Anonymized)",
    thumbnail: "/next.svg",
    seller: { name: "HealthData Corp", reputation: 4.7 },
    qualityScore: 97,
    price: "$899",
    diversity: 95,
    accuracy: 98,
    bias: 96
  },
];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-6xl font-bold text-white mb-4">
            Dataset Marketplace
          </h1>
          <p className="font-body text-xl text-[var(--color-fg-secondary)]">
            Browse verified, AI-scored datasets with blockchain certification
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search datasets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="!bg-[rgba(28,28,30,0.6)]"
            />
          </div>
          <Button variant="secondary" icon={<SlidersHorizontal className="w-5 h-5" />}>
            Filters
          </Button>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {datasets.map((dataset) => (
            <GlassCard key={dataset.id} className="group cursor-pointer">
              {/* Thumbnail */}
              <div className="relative w-full h-48 bg-[var(--color-bg-elevated)] rounded-xl mb-4 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[var(--color-fg-tertiary)] text-sm">Dataset Preview</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-display text-lg font-semibold text-white mb-2 group-hover:text-[var(--color-accent-green)] transition-colors">
                {dataset.title}
              </h3>

              {/* Seller Info */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-[var(--color-accent-green)]/20" />
                <span className="text-sm text-[var(--color-fg-secondary)]">{dataset.seller.name}</span>
                <div className="flex items-center gap-1 ml-auto">
                  <Star className="w-4 h-4 text-[var(--color-accent-orange)] fill-current" />
                  <span className="text-sm font-medium text-white">{dataset.seller.reputation}</span>
                </div>
              </div>

              {/* Quality Score */}
              <div className="mb-4 p-3 bg-[var(--color-accent-green)]/10 border border-[var(--color-accent-green)]/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-fg-secondary)]">Quality Score</span>
                  <span className="text-2xl font-bold text-[var(--color-accent-green)]">{dataset.qualityScore}</span>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                <div className="text-center">
                  <div className="text-[var(--color-fg-tertiary)]">Diversity</div>
                  <div className="font-semibold text-white">{dataset.diversity}</div>
                </div>
                <div className="text-center">
                  <div className="text-[var(--color-fg-tertiary)]">Accuracy</div>
                  <div className="font-semibold text-white">{dataset.accuracy}</div>
                </div>
                <div className="text-center">
                  <div className="text-[var(--color-fg-tertiary)]">Bias</div>
                  <div className="font-semibold text-white">{dataset.bias}</div>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="font-display text-2xl font-bold text-[var(--color-accent-orange)]">
                  {dataset.price}
                </span>
                <Button variant="primary" size="sm">
                  View Details
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`w-10 h-10 rounded-lg font-medium transition-all ${
                page === 1
                  ? 'bg-[var(--color-accent-green)] text-white'
                  : 'bg-[rgba(28,28,30,0.6)] text-[var(--color-fg-secondary)] hover:bg-[rgba(28,28,30,0.8)]'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
