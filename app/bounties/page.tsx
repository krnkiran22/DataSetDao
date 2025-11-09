'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function BountiesPage() {
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
            <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-accent-orange to-accent-red flex items-center justify-center shadow-glow-magenta">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="6"/>
                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/> 
              </svg>
            </div>

            <h1 className="font-display text-5xl font-bold text-foreground-primary mb-4">
              Bounty Board
            </h1>

            <p className="text-xl text-foreground-secondary mb-8">
              Post dataset requests or compete to fulfill bounties and earn rewards
            </p>

            <div className="inline-block px-6 py-3 bg-accent-orange/10 border border-accent-orange/30 rounded-full mb-12">
              <span className="text-accent-orange font-semibold">🎯 Coming Soon</span>
            </div>

            {/* Mock Bounty Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {[
                { title: 'High-Res Satellite Imagery', reward: '$5,000', deadline: '15 days', applicants: 23 },
                { title: 'Financial Transaction Logs', reward: '$3,500', deadline: '8 days', applicants: 17 },
                { title: 'Multi-Language Speech Data', reward: '$8,000', deadline: '30 days', applicants: 41 },
                { title: 'Industrial Sensor Readings', reward: '$2,000', deadline: '5 days', applicants: 12 },
              ].map((bounty, i) => (
                <motion.div
                  key={bounty.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-background-elevated/60 backdrop-blur-2xl border border-accent-orange/20 rounded-xl p-6 hover:border-accent-orange/40 transition-all text-left"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-display text-xl font-semibold text-foreground-primary">{bounty.title}</h3>
                    <span className="px-3 py-1 bg-accent-orange/10 border border-accent-orange/30 rounded-full text-accent-orange font-bold text-sm whitespace-nowrap">
                      {bounty.reward}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-foreground-secondary">
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                        <line x1="16" x2="16" y1="2" y2="6"/>
                        <line x1="8" x2="8" y1="2" y2="6"/>
                        <line x1="3" x2="21" y1="10" y2="10"/>
                      </svg>
                      {bounty.deadline} left
                    </div>
                    <div className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                      {bounty.applicants} applicants
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              <button className="px-8 py-4 bg-accent-orange text-white rounded-full font-semibold hover:bg-accent-red hover:shadow-glow-magenta transition-all duration-200">
                Post a Bounty
              </button>
              <Link href="/marketplace">
                <button className="px-8 py-4 bg-transparent border-2 border-accent-orange/40 text-white rounded-full font-semibold hover:bg-accent-orange/10 hover:border-accent-orange transition-all duration-200">
                  Browse Datasets
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
