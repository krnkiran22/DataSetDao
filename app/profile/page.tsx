'use client';

import { Navbar } from '@/components/ui/Navbar';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ProfilePage() {
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
            {/* Avatar */}
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-accent-pink via-accent-magenta to-accent-mesh flex items-center justify-center text-white text-5xl font-bold shadow-glow-pink">
              U
            </div>

            <h1 className="font-display text-5xl font-bold text-foreground-primary mb-4">
              User Profile
            </h1>

            <p className="text-xl text-foreground-secondary mb-8">
              Manage your profile, reputation, and public presence in the DatasetDAO community
            </p>

            <div className="inline-block px-6 py-3 bg-accent-pink/10 border border-accent-pink/30 rounded-full mb-12">
              <span className="text-accent-pink font-semibold">🚀 Coming Soon</span>
            </div>

            {/* Mock Profile Card */}
            <div className="bg-background-elevated/60 backdrop-blur-2xl border border-accent-pink/20 rounded-2xl p-8 mb-12 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-foreground-secondary mb-4">PROFILE INFORMATION</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-foreground-tertiary mb-1">Username</label>
                      <div className="text-foreground-primary font-semibold">@dataexplorer</div>
                    </div>
                    <div>
                      <label className="block text-xs text-foreground-tertiary mb-1">Member Since</label>
                      <div className="text-foreground-primary">November 2024</div>
                    </div>
                    <div>
                      <label className="block text-xs text-foreground-tertiary mb-1">Wallet Address</label>
                      <div className="text-foreground-primary font-mono text-sm">0x1234...5678</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground-secondary mb-4">REPUTATION</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground-tertiary text-sm">Overall Rating</span>
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FF6B35" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                        ))}
                        <span className="text-foreground-primary font-semibold ml-1">4.9</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground-tertiary text-sm">Transactions</span>
                      <span className="text-foreground-primary font-semibold">156</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground-tertiary text-sm">Verified Datasets</span>
                      <span className="text-foreground-primary font-semibold">42</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/dashboard">
              <button className="px-8 py-4 bg-accent-pink text-white rounded-full font-semibold hover:bg-accent-magenta hover:shadow-glow-pink transition-all duration-200">
                Go to Dashboard
              </button>
            </Link>
          </motion.div>
        </div>
      </main>
    </>
  );
}
