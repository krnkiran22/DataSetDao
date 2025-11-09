'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useToast } from '@/lib/context/ToastContext';
import { motion } from 'framer-motion';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  datasetName: string;
  price: number;
  datasetId: string;
}

export function PurchaseModal({
  isOpen,
  onClose,
  datasetName,
  price,
  datasetId,
}: PurchaseModalProps) {
  const [step, setStep] = useState<'connect' | 'confirm' | 'processing' | 'success'>('connect');
  const currentAccount = useCurrentAccount();
  const { showToast } = useToast();

  const handlePurchase = async () => {
    if (!currentAccount) {
      showToast('Please connect your wallet first', 'warning');
      return;
    }

    setStep('processing');

    // Simulate transaction processing
    setTimeout(() => {
      setStep('success');
      showToast('Dataset purchased successfully!', 'success');
    }, 3000);
  };

  const handleClose = () => {
    if (step === 'processing') return; // Prevent closing during processing
    setStep('connect');
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={handleClose} size="md">
      {/* Connect Wallet Step */}
      {step === 'connect' && (
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent-pink to-accent-magenta flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-foreground-primary mb-4">
            Purchase Dataset
          </h3>
          
          <p className="text-foreground-secondary mb-6">
            You're about to purchase <strong>{datasetName}</strong> for ${price}
          </p>

          {!currentAccount ? (
            <div className="bg-accent-orange/10 border border-accent-orange/30 rounded-xl p-4 mb-6">
              <p className="text-accent-orange font-semibold">
                Please connect your wallet to continue
              </p>
            </div>
          ) : (
            <div className="bg-accent-green/10 border border-accent-green/30 rounded-xl p-4 mb-6">
              <p className="text-accent-green font-semibold">
                Wallet connected: {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
              </p>
            </div>
          )}

          <div className="space-y-3">
            {currentAccount ? (
              <button
                onClick={() => setStep('confirm')}
                className="w-full px-6 py-4 bg-gradient-to-r from-accent-pink to-accent-magenta text-white rounded-full font-semibold hover:shadow-glow-pink transition-all duration-200"
              >
                Continue to Payment
              </button>
            ) : (
              <div className="text-sm text-foreground-tertiary">
                Click "Connect Wallet" in the navbar to get started
              </div>
            )}
            <button
              onClick={handleClose}
              className="w-full px-6 py-4 bg-transparent border border-border-DEFAULT text-foreground-secondary rounded-full font-semibold hover:border-accent-pink/40 hover:text-foreground-primary transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Confirm Step */}
      {step === 'confirm' && (
        <div>
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-accent-pink/10 border border-accent-pink/30 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-pink">
                <path d="M3 3v18h18"/>
                <path d="m19 9-5 5-4-4-3 3"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-foreground-primary mb-2">
              Confirm Purchase
            </h3>
            <p className="text-foreground-secondary">
              Review the details before confirming
            </p>
          </div>

          <div className="bg-background-surface/60 rounded-xl p-6 mb-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-foreground-secondary">Dataset</span>
              <span className="font-semibold text-foreground-primary">{datasetName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-secondary">Price</span>
              <span className="font-semibold text-accent-orange">${price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-secondary">Network Fee</span>
              <span className="font-semibold text-foreground-primary">~$0.05</span>
            </div>
            <div className="border-t border-border-subtle pt-4 flex justify-between">
              <span className="font-bold text-foreground-primary">Total</span>
              <span className="font-bold text-accent-orange text-xl">${(price + 0.05).toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-accent-blue/10 border border-accent-blue/30 rounded-xl p-4 mb-6">
            <p className="text-sm text-foreground-secondary">
              <strong className="text-accent-blue">What you'll receive:</strong>
              <br />
              • Full dataset download access
              • Decryption key via Seal Protocol
              • Quality certificate
              • License documentation
              • 30-day support
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handlePurchase}
              className="w-full px-6 py-4 bg-gradient-to-r from-accent-pink to-accent-magenta text-white rounded-full font-semibold hover:shadow-glow-pink transition-all duration-200"
            >
              Confirm & Pay ${price}
            </button>
            <button
              onClick={() => setStep('connect')}
              className="w-full px-6 py-4 bg-transparent border border-border-DEFAULT text-foreground-secondary rounded-full font-semibold hover:border-accent-pink/40 hover:text-foreground-primary transition-all duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      )}

      {/* Processing Step */}
      {step === 'processing' && (
        <div className="text-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 mx-auto mb-6 rounded-full border-4 border-accent-pink/20 border-t-accent-pink"
          />
          
          <h3 className="text-2xl font-bold text-foreground-primary mb-4">
            Processing Transaction
          </h3>
          
          <p className="text-foreground-secondary mb-6">
            Please wait while we process your payment...
          </p>

          <div className="space-y-3 text-left max-w-md mx-auto">
            {[
              { label: 'Verifying wallet balance', done: true },
              { label: 'Processing payment', done: true },
              { label: 'Generating decryption key', done: false },
              { label: 'Granting access', done: false },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.3 }}
                className="flex items-center gap-3"
              >
                {item.done ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-green">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <div className="w-5 h-5 border-2 border-accent-pink/30 border-t-accent-pink rounded-full animate-spin" />
                )}
                <span className={item.done ? 'text-foreground-primary' : 'text-foreground-secondary'}>
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Success Step */}
      {step === 'success' && (
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent-green/20 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-green">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </motion.div>
          
          <h3 className="text-2xl font-bold text-foreground-primary mb-4">
            Purchase Successful!
          </h3>
          
          <p className="text-foreground-secondary mb-6">
            Your dataset has been unlocked and is ready to download
          </p>

          <div className="bg-accent-pink/10 border border-accent-pink/30 rounded-xl p-6 mb-6 text-left">
            <h4 className="font-bold text-foreground-primary mb-3">Decryption Key</h4>
            <div className="bg-background-surface rounded-lg p-3 font-mono text-sm text-accent-pink break-all mb-3">
              0x{Math.random().toString(16).substring(2, 34)}...
            </div>
            <p className="text-xs text-foreground-tertiary">
              This key has been saved to your account. Keep it secure!
            </p>
          </div>

          <div className="space-y-3">
            <button
              className="w-full px-6 py-4 bg-gradient-to-r from-accent-pink to-accent-magenta text-white rounded-full font-semibold hover:shadow-glow-pink transition-all duration-200"
            >
              Download Dataset
            </button>
            <button
              onClick={handleClose}
              className="w-full px-6 py-4 bg-transparent border border-border-DEFAULT text-foreground-secondary rounded-full font-semibold hover:border-accent-pink/40 hover:text-foreground-primary transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
