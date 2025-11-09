'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Navbar } from '@/components/ui/Navbar';
import { motion } from 'framer-motion';
import { useToast } from '@/lib/context/ToastContext';
import { useCurrentAccount } from '@mysten/dapp-kit';

export default function UploadPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { showToast } = useToast();
  const currentAccount = useCurrentAccount();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Validate file size (max 10 GB = 10,737,418,240 bytes)
      const maxSize = 10 * 1024 * 1024 * 1024;
      if (file.size > maxSize) {
        showToast('File size exceeds 10 GB limit', 'error');
        return;
      }

      setUploadedFile(file);
      showToast(`File "${file.name}" selected successfully`, 'success');
    }
  }, [showToast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'application/x-parquet': ['.parquet'],
      'application/zip': ['.zip'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'audio/*': ['.mp3', '.wav', '.flac'],
      'video/*': ['.mp4', '.avi', '.mov'],
    },
  });

  const handleStartUpload = () => {
    if (!currentAccount) {
      showToast('Please connect your wallet first', 'warning');
      return;
    }

    if (!uploadedFile) {
      showToast('Please select a file first', 'warning');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          showToast('File uploaded successfully! Processing...', 'success');
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    showToast('File removed', 'info');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

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
            <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-accent-pink to-accent-magenta flex items-center justify-center shadow-glow-pink">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" x2="12" y1="3" y2="15"/>
              </svg>
            </div>

            <h1 className="font-display text-5xl font-bold text-foreground-primary mb-4">
              Upload Your Dataset
            </h1>

            <p className="text-xl text-foreground-secondary mb-8">
              A 5-step wizard to encrypt, verify, and list your dataset on the marketplace
            </p>

            {!currentAccount && (
              <div className="inline-block px-6 py-3 bg-accent-orange/10 border border-accent-orange/30 rounded-full mb-8">
                <span className="text-accent-orange font-semibold">⚠️ Please connect your wallet to upload</span>
              </div>
            )}

            {/* Mock Step Indicator */}
            <div className="bg-background-elevated/60 backdrop-blur-2xl border border-accent-pink/20 rounded-2xl p-8 mb-8">
              <div className="flex items-center justify-between max-w-2xl mx-auto">
                {[
                  { step: 1, label: 'Upload' },
                  { step: 2, label: 'Metadata' },
                  { step: 3, label: 'Encrypting' },
                  { step: 4, label: 'Verification' },
                  { step: 5, label: 'Listing' },
                ].map((item, i) => (
                  <div key={item.step} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                        i === 0 ? 'bg-accent-pink text-white' : 'bg-background-surface text-foreground-tertiary border-2 border-border-DEFAULT'
                      }`}>
                        {item.step}
                      </div>
                      <span className="text-xs text-foreground-secondary mt-2">{item.label}</span>
                    </div>
                    {i < 4 && (
                      <div className="w-16 h-0.5 bg-border-DEFAULT mx-2 mb-6" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Upload Box */}
            {!uploadedFile ? (
              <div
                {...getRootProps()}
                className={`bg-background-elevated/60 backdrop-blur-2xl border-2 border-dashed rounded-2xl p-16 mb-12 transition-all cursor-pointer ${
                  isDragActive
                    ? 'border-accent-pink bg-accent-pink/10 scale-[1.02]'
                    : 'border-accent-pink/30 hover:border-accent-pink/60'
                }`}
              >
                <input {...getInputProps()} />
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-accent-pink">
                  <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
                  <path d="M12 12v9"/>
                  <path d="m16 16-4-4-4 4"/>
                </svg>
                {isDragActive ? (
                  <p className="text-xl text-accent-pink font-semibold mb-2">Drop the file here...</p>
                ) : (
                  <>
                    <p className="text-xl text-foreground-primary font-semibold mb-2">Drag and drop your file here</p>
                    <p className="text-sm text-foreground-tertiary">or click to browse</p>
                  </>
                )}
                <p className="text-xs text-foreground-tertiary mt-4">Supported: CSV, JSON, Parquet, ZIP, Images, Audio, Video • Max 10 GB</p>
              </div>
            ) : (
              <div className="bg-background-elevated/60 backdrop-blur-2xl border border-accent-pink/20 rounded-2xl p-8 mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-accent-pink/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-pink">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-lg font-semibold text-foreground-primary">{uploadedFile.name}</p>
                    <p className="text-sm text-foreground-secondary">{formatFileSize(uploadedFile.size)}</p>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                    disabled={isUploading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"/>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    </svg>
                  </button>
                </div>

                {isUploading && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-foreground-secondary mb-2">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-background-surface rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-accent-pink to-accent-magenta"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <p className="text-sm text-foreground-tertiary mb-8">
              <strong>What happens next:</strong> Your dataset will be encrypted with Seal Protocol, uploaded to Walrus decentralized storage,
              verified by AI, and automatically listed on the marketplace with blockchain certification.
            </p>

            <button
              onClick={handleStartUpload}
              disabled={!uploadedFile || isUploading || !currentAccount}
              className="px-8 py-4 bg-accent-pink text-white rounded-full font-semibold hover:bg-accent-magenta hover:shadow-glow-pink transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Start Upload Process'}
            </button>
          </motion.div>
        </div>
      </main>
    </>
  );
}
