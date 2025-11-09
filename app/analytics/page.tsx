'use client';

import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AnalyticsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-base pt-24">
        <div className="container-center py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Icon */}
            <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-accent-teal to-accent-indigo flex items-center justify-center shadow-glow-pink">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" x2="12" y1="20" y2="10"/>
                <line x1="18" x2="18" y1="20" y2="4"/>
                <line x1="6" x2="6" y1="20" y2="16"/>
              </svg>
            </div>

            <h1 className="font-display text-5xl font-bold text-foreground-primary mb-4">
              Training Results Analytics
            </h1>

            <p className="text-xl text-foreground-secondary mb-8">
              Submit and view model training results to prove dataset quality and earn reputation
            </p>

            <div className="inline-block px-6 py-3 bg-accent-teal/10 border border-accent-teal/30 rounded-full mb-12">
              <span className="text-accent-teal font-semibold">📊 Coming Soon</span>
            </div>

            {/* Mock Analytics Chart */}
            <div className="bg-background-elevated/60 backdrop-blur-2xl border border-accent-teal/20 rounded-2xl p-8 mb-12">
              <div className="text-left mb-6">
                <h3 className="text-sm font-semibold text-foreground-secondary mb-2">SAMPLE ANALYTICS</h3>
                <p className="text-2xl font-bold text-foreground-primary">94.3%</p>
                <p className="text-sm text-foreground-tertiary">Average model accuracy across 127 trainings</p>
              </div>

              {/* Mock Chart Bars */}
              <div className="space-y-4">
                {[
                  { model: 'ResNet-50', accuracy: 96, color: '#E6007A' },
                  { model: 'VGG-16', accuracy: 94, color: '#FF006B' },
                  { model: 'MobileNet', accuracy: 92, color: '#14B8A6' },
                  { model: 'EfficientNet', accuracy: 95, color: '#FF6B35' },
                  { model: 'DenseNet', accuracy: 93, color: '#8B5CF6' },
                ].map((item) => (
                  <div key={item.model} className="flex items-center gap-4">
                    <div className="w-32 text-sm text-foreground-secondary text-right">{item.model}</div>
                    <div className="flex-1 h-8 bg-background-surface rounded-lg overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.accuracy}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full rounded-lg flex items-center justify-end pr-3"
                        style={{ 
                          background: `linear-gradient(90deg, ${item.color}80, ${item.color})`,
                        }}
                      >
                        <span className="text-white font-bold text-sm">{item.accuracy}%</span>
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button className="px-8 py-4 bg-accent-teal text-white rounded-full font-semibold hover:bg-accent-indigo hover:shadow-glow-pink transition-all duration-200">
                Submit Training Results
              </button>
              <Link href="/marketplace">
                <button className="px-8 py-4 bg-transparent border-2 border-accent-teal/40 text-white rounded-full font-semibold hover:bg-accent-teal/10 hover:border-accent-teal transition-all duration-200">
                  Browse Datasets
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
