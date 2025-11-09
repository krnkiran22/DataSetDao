'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  ShieldAlert, 
  UserX, 
  FileX, 
  EyeOff, 
  AlertCircle,
  Sparkles,
  Shield,
  Database,
  Check,
  Upload,
  Lock,
  Cpu,
  BadgeCheck,
  ShoppingBag,
  Repeat,
  Rocket,
  Book,
  Zap
} from 'lucide-react';
import { Hero } from '@/components/ui/Hero/Hero';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';

const painPoints = [
  {
    icon: ShieldAlert,
    title: "Zero Quality Verification",
    description: "Buyers have no way to verify dataset quality before purchase, leading to wasted investments and failed projects.",
    stat: "73% of datasets fail expectations"
  },
  {
    icon: UserX,
    title: "No Seller Accountability",
    description: "Sellers face no consequences for misrepresenting data quality, creating a race to the bottom.",
    stat: "$580M wasted on bad data annually"
  },
  {
    icon: FileX,
    title: "License Violations",
    description: "No mechanism to prove dataset ownership or detect unauthorized usage after purchase.",
    stat: "42% unauthorized usage rate"
  },
  {
    icon: EyeOff,
    title: "Privacy Risks",
    description: "Datasets with PII lack verifiable anonymization, exposing buyers to regulatory risks.",
    stat: "89% lack privacy proofs"
  }
];

const pillars = [
  {
    icon: Sparkles,
    title: "AI Quality Analysis",
    description: "Automated scoring across diversity, accuracy, bias, and format metrics.",
    features: [
      "Objective 0-100 quality score",
      "Multi-dimensional analysis",
      "Consistent evaluation"
    ]
  },
  {
    icon: Shield,
    title: "Immutable Certification",
    description: "Quality scores stored on-chain, creating tamper-proof records.",
    features: [
      "Transparent verification",
      "Permanent records",
      "Smart contract automation"
    ]
  },
  {
    icon: Database,
    title: "Decentralized Storage",
    description: "Large blob storage with cryptographic access control.",
    features: [
      "Scalable architecture",
      "Seal encryption",
      "Provable availability"
    ]
  }
];

const steps = [
  { icon: Upload, title: "Upload Dataset", description: "Drag and drop your dataset files securely to our platform." },
  { icon: Lock, title: "Seal Encryption", description: "Data encrypted client-side before upload for complete privacy." },
  { icon: Cpu, title: "AI Analysis", description: "Quality verification across multiple dimensions in minutes." },
  { icon: BadgeCheck, title: "Blockchain Certification", description: "Quality score recorded immutably on smart contract." },
  { icon: ShoppingBag, title: "Marketplace Listing", description: "Dataset goes live with verified quality badge." },
  { icon: Repeat, title: "Secure Trading", description: "Buyers purchase with confidence, sellers earn reputation." }
];

function ProblemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="min-h-screen py-40 md:py-48 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24 md:mb-32"
        >
          <span className="font-mono text-xs tracking-widest uppercase text-[var(--color-accent-orange)] block mb-6">
            THE PROBLEM
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Dataset Marketplaces Lack Trust
          </h2>
          <p className="font-body text-lg md:text-xl text-[var(--color-fg-secondary)] max-w-2xl mx-auto leading-relaxed">
            Buyers purchase datasets blindly. Sellers can't prove quality. Everyone loses.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {painPoints.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <GlassCard className="h-full p-10 md:p-12">
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8">
                  <point.icon className="w-7 h-7 text-[var(--color-accent-red)]" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-white mb-4 leading-tight">
                  {point.title}
                </h3>
                <p className="font-body text-base text-[var(--color-fg-secondary)] leading-[1.7] mb-6">
                  {point.description}
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-accent-orange)] mt-auto">
                  <AlertCircle className="w-4 h-4" />
                  <span>{point.stat}</span>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SolutionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="min-h-screen py-40 md:py-48 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-28 md:mb-36"
        >
          <span className="font-mono text-xs tracking-widest uppercase text-[var(--color-accent-green)] block mb-6">
            THE SOLUTION
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            DatasetDAO: Trust Through Verification
          </h2>
          <p className="font-body text-lg md:text-xl text-[var(--color-fg-secondary)] max-w-3xl mx-auto leading-relaxed">
            Combining AI quality verification with blockchain certification to create the world's first trustless dataset marketplace.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ scale: 1.02 }}
            >
              <GlassCard className="h-full p-10 md:p-12">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-accent-green)]/20 to-transparent flex items-center justify-center mb-10">
                  <pillar.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-semibold text-white mb-5 leading-tight">
                  {pillar.title}
                </h3>
                <p className="font-body text-base text-[var(--color-fg-secondary)] leading-[1.7] mb-8">
                  {pillar.description}
                </p>
                <div className="space-y-4">
                  {pillar.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-[var(--color-accent-green)] flex-shrink-0 mt-0.5" />
                      <span className="font-body text-sm text-[var(--color-fg-secondary)] leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="min-h-screen py-40 md:py-48 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-28 md:mb-36"
        >
          <span className="font-mono text-xs tracking-widest uppercase text-[var(--color-accent-green)] block mb-6">
            HOW IT WORKS
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            From Upload to Trade in Six Steps
          </h2>
          <p className="font-body text-lg md:text-xl text-[var(--color-fg-secondary)] max-w-2xl mx-auto leading-relaxed">
            A seamless workflow powered by AI and blockchain
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative">
                <div className="absolute -top-5 -left-5 w-14 h-14 rounded-full bg-[rgba(28,28,30,0.9)] border-2 border-[var(--color-accent-green)] flex items-center justify-center z-10 shadow-lg">
                  <span className="font-display text-xl font-bold text-white">{index + 1}</span>
                </div>
                <GlassCard className="p-10 pt-12">
                  <step.icon className="w-8 h-8 text-[var(--color-accent-green)] mb-6" />
                  <h3 className="font-display text-xl font-semibold text-white mb-4 leading-tight">
                    {step.title}
                  </h3>
                  <p className="font-body text-sm text-[var(--color-fg-secondary)] leading-[1.7]">
                    {step.description}
                  </p>
                </GlassCard>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="min-h-[80vh] py-40 md:py-48 px-6 relative overflow-hidden">
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-[var(--color-accent-green)]/5 via-transparent to-transparent" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        <div className="inline-block mb-8 px-5 py-2.5 rounded-full bg-[rgba(28,28,30,0.6)] border border-[var(--color-accent-green)]/30 backdrop-blur-xl">
          <span className="font-mono text-xs tracking-widest uppercase text-[var(--color-accent-green)]">
            START TODAY
          </span>
        </div>

        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-10 px-4">
          Ready to Trade Datasets with Confidence?
        </h2>

        <p className="font-body text-lg md:text-xl text-[var(--color-fg-secondary)] max-w-2xl mx-auto leading-[1.7] mb-14 px-4">
          Join the future of dataset marketplaces. Upload your first dataset or start browsing verified data today.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center mb-20">
          <Button
            variant="primary"
            size="lg"
            icon={<Rocket className="w-5 h-5" />}
            iconPosition="right"
            className="shadow-[var(--shadow-glow-green)]"
          >
            Launch App
          </Button>
          <Button
            variant="secondary"
            size="lg"
            icon={<Book className="w-5 h-5" />}
            iconPosition="left"
          >
            View Documentation
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-sm text-[var(--color-fg-tertiary)]">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-[var(--color-accent-green)]" />
            <span>Blockchain Verified</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Cpu className="w-4 h-4 text-[var(--color-accent-teal)]" />
            <span>AI Powered</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-[var(--color-accent-orange)]" />
            <span>Encrypted Storage</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-[var(--color-accent-green)]" />
            <span>Instant Verification</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <>
      <Hero />
      
      {/* Section Divider */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
      
      <ProblemSection />
      
      {/* Section Divider */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
      
      <SolutionSection />
      
      {/* Section Divider */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
      
      <HowItWorksSection />
      
      {/* Section Divider */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
      
      <CTASection />
    </>
  );
}
