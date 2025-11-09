'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <>
      <main className="min-h-screen bg-background-base pt-24">
        <div className="container-center py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Icon */}
            <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-accent-pink to-accent-magenta flex items-center justify-center shadow-glow-pink">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="7" height="9" x="3" y="3" rx="1"/>
                <rect width="7" height="5" x="14" y="3" rx="1"/>
                <rect width="7" height="9" x="14" y="12" rx="1"/>
                <rect width="7" height="5" x="3" y="16" rx="1"/>
              </svg>
            </div>

            <h1 className="font-display text-5xl font-bold text-foreground-primary mb-4">
              User Dashboard
            </h1>

            <p className="text-xl text-foreground-secondary mb-8">
              View your datasets, purchases, earnings, and analytics in one central hub
            </p>

            <div className="inline-block px-6 py-3 bg-accent-pink/10 border border-accent-pink/30 rounded-full mb-12">
              <span className="text-accent-pink font-semibold">🚀 Coming Soon</span>
            </div>

            {/* Mock Dashboard Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { label: 'Total Earnings', value: '$12,450', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
                { label: 'Datasets Listed', value: '23', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>' },
                { label: 'Purchases', value: '47', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-background-elevated/60 backdrop-blur-2xl border border-accent-pink/20 rounded-xl p-6 hover:border-accent-pink/40 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span dangerouslySetInnerHTML={{ __html: stat.icon }} className="text-accent-pink" />
                  </div>
                  <div className="text-3xl font-bold text-foreground-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-foreground-secondary">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              <Link href="/marketplace">
                <button className="px-8 py-4 bg-accent-pink text-white rounded-full font-semibold hover:bg-accent-magenta hover:shadow-glow-pink transition-all duration-200">
                  Browse Marketplace
                </button>
              </Link>
              <Link href="/upload">
                <button className="px-8 py-4 bg-transparent border-2 border-accent-pink/40 text-white rounded-full font-semibold hover:bg-accent-pink/10 hover:border-accent-pink transition-all duration-200">
                  Upload Dataset
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
