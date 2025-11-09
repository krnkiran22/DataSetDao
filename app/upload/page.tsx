'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { useToast } from '@/lib/context/ToastContext';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { walrusService } from '@/lib/walrus/walrusService';
import { analyzeDataset, canAnalyzeFile, readJsonFile, type DatasetAnalysis } from '@/lib/ai/groqService';
import { mintDatasetCertificate, getExplorerUrl, getNFTExplorerUrl, isContractConfigured } from '@/lib/contract/nftService';

export default function UploadPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [blobId, setBlobId] = useState<string | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<DatasetAnalysis | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isMinting, setIsMinting] = useState(false);
  const [mintedNFT, setMintedNFT] = useState<{ digest: string; nftId?: string } | null>(null);
  const [datasetTitle, setDatasetTitle] = useState<string>('');
  const { showToast } = useToast();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

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
      setCurrentStep(1); // Stay on step 1 (Upload) when file is selected
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

  const handleStartUpload = async () => {
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
    setUploadComplete(false);
    setBlobId(null);
    setAiAnalysis(null);
    setCurrentStep(2); // Move to step 2 (Metadata/Processing)

    try {
      // Animate progress while uploading
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90; // Stop at 90% until upload completes
          }
          return prev + 10;
        });
      }, 500);

      showToast('Uploading to Walrus...', 'info');

      // Upload to Walrus
      const result = await walrusService.storeFile(uploadedFile);

      clearInterval(progressInterval);

      if (result.success && result.blobId) {
        setUploadProgress(100);
        setBlobId(result.blobId);
        setUploadComplete(true);
        setCurrentStep(3); // Move to step 3 (Encrypting/Complete)
        showToast('File uploaded successfully to Walrus!', 'success');
        
        console.log('📦 Upload successful!');
        console.log('🆔 Blob ID:', result.blobId);
        console.log('📊 Size:', result.size, 'bytes');
        if (result.cost) {
          console.log('💰 Cost:', result.cost);
        }

        // Trigger AI analysis for JSON files
        if (canAnalyzeFile(uploadedFile)) {
          setIsAnalyzing(true);
          setCurrentStep(4); // Move to step 4 (Verification/Analysis)
          showToast('Analyzing dataset with AI...', 'info');
          
          try {
            const jsonData = await readJsonFile(uploadedFile);
            const analysis = await analyzeDataset(jsonData);
            setAiAnalysis(analysis);
            setCurrentStep(5); // Move to step 5 (Listing/Complete)
            showToast('AI analysis completed!', 'success');
          } catch (analysisError) {
            console.error('AI analysis error:', analysisError);
            showToast(
              analysisError instanceof Error ? analysisError.message : 'AI analysis failed',
              'warning'
            );
            setCurrentStep(3); // Stay at step 3 if analysis fails
          } finally {
            setIsAnalyzing(false);
          }
        }
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showToast(error instanceof Error ? error.message : 'Upload failed', 'error');
      setUploadProgress(0);
      setCurrentStep(1); // Go back to step 1 on error
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setBlobId(null);
    setUploadComplete(false);
    setAiAnalysis(null);
    setCurrentStep(1); // Reset to step 1
    showToast('File removed', 'info');
  };

  const copyBlobId = () => {
    if (blobId) {
      navigator.clipboard.writeText(blobId);
      showToast('Blob ID copied to clipboard!', 'success');
    }
  };

  const getBlobUrl = () => {
    if (blobId) {
      return walrusService.getBlobUrl(blobId);
    }
    return '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleMintNFT = async () => {
    if (!currentAccount) {
      showToast('Please connect your wallet first', 'warning');
      return;
    }

    if (!blobId || !aiAnalysis || !uploadedFile) {
      showToast('Missing required data for minting NFT', 'error');
      return;
    }

    if (!datasetTitle || datasetTitle.trim() === '') {
      showToast('Please enter a dataset title', 'warning');
      return;
    }

    if (!isContractConfigured()) {
      showToast('Smart contract not deployed yet. Please deploy the contract first!', 'error');
      return;
    }

    setIsMinting(true);

    try {
      console.log('🎨 Minting NFT Certificate...');
      
      const result = await mintDatasetCertificate(
        {
          title: datasetTitle.trim(),
          qualityScore: aiAnalysis.qualityScore,
          diversityScore: aiAnalysis.diversity,
          accuracyScore: aiAnalysis.accuracy,
          completenessScore: aiAnalysis.completeness,
          consistencyScore: aiAnalysis.consistency,
          biasLevel: aiAnalysis.bias,
          blobId: blobId,
          datasetType: uploadedFile.type || 'application/octet-stream',
          datasetSize: uploadedFile.size,
          totalRecords: aiAnalysis.statistics.totalRecords,
        },
        signAndExecute
      );

      if (result.success) {
        setMintedNFT({
          digest: result.transactionDigest!,
          nftId: result.nftId,
        });
        showToast('NFT Certificate minted successfully! 🎉', 'success');
        console.log('✅ NFT Minted!');
        console.log('📝 Transaction:', result.transactionDigest);
        if (result.nftId) {
          console.log('🆔 NFT ID:', result.nftId);
        }
      } else {
        throw new Error(result.error || 'Minting failed');
      }
    } catch (error) {
      console.error('❌ NFT minting error:', error);
      showToast(
        error instanceof Error ? error.message : 'Failed to mint NFT',
        'error'
      );
    } finally {
      setIsMinting(false);
    }
  };

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

            {/* Step Indicator */}
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
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                        currentStep >= item.step 
                          ? 'bg-gradient-to-br from-accent-pink to-accent-magenta text-white shadow-glow-pink' 
                          : 'bg-background-surface text-foreground-tertiary border-2 border-border-DEFAULT'
                      }`}>
                        {currentStep > item.step ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        ) : (
                          item.step
                        )}
                      </div>
                      <span className={`text-xs mt-2 transition-colors ${
                        currentStep >= item.step ? 'text-accent-pink font-semibold' : 'text-foreground-secondary'
                      }`}>
                        {item.label}
                      </span>
                    </div>
                    {i < 4 && (
                      <div className={`w-16 h-0.5 mx-2 mb-6 transition-all duration-300 ${
                        currentStep > item.step ? 'bg-gradient-to-r from-accent-pink to-accent-magenta' : 'bg-border-DEFAULT'
                      }`} />
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
                      <span>Uploading to Walrus...</span>
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

                {uploadComplete && blobId && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-accent-green/10 border border-accent-green/30 rounded-xl p-6 mb-6"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-green">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                      <h3 className="text-lg font-bold text-accent-green">Upload Successful!</h3>
                    </div>
                    
                    <div className="bg-background-base/50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-foreground-secondary">Blob ID:</span>
                        <button
                          onClick={copyBlobId}
                          className="text-xs px-3 py-1 bg-accent-pink/10 text-accent-pink rounded-full hover:bg-accent-pink/20 transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                      <p className="text-sm text-foreground-primary font-mono break-all">{blobId}</p>
                    </div>

                    <div className="flex gap-3">
                      <a
                        href={getBlobUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-2 bg-accent-pink text-white rounded-lg text-sm font-semibold hover:bg-accent-magenta transition-colors text-center"
                      >
                        View on Walrus
                      </a>
                      <button
                        onClick={() => {
                          setUploadedFile(null);
                          setUploadProgress(0);
                          setBlobId(null);
                          setUploadComplete(false);
                          setAiAnalysis(null);
                          setCurrentStep(1); // Reset to step 1
                        }}
                        className="px-4 py-2 bg-background-surface text-foreground-primary rounded-lg text-sm font-semibold hover:bg-background-elevated transition-colors"
                      >
                        Upload Another
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* AI Analysis Results */}
                {isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-accent-pink/10 border border-accent-pink/30 rounded-xl p-6 mb-6"
                  >
                    <div className="flex items-center gap-3">
                      <div className="animate-spin">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-pink">
                          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground-primary">Analyzing with AI...</h3>
                        <p className="text-sm text-foreground-secondary">Groq AI is evaluating your dataset quality</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {aiAnalysis && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-background-elevated/80 backdrop-blur-xl border border-accent-pink/20 rounded-xl p-6 mb-6"
                  >
                    <div className="flex items-center gap-2 mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-pink">
                        <path d="M12 3l-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                      </svg>
                      <h3 className="text-xl font-bold text-foreground-primary">AI Quality Analysis</h3>
                    </div>

                    {/* Overall Quality Score */}
                    <div className="bg-gradient-to-r from-accent-pink/10 to-accent-magenta/10 rounded-lg p-6 mb-6">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-accent-pink mb-2">{aiAnalysis.qualityScore}</div>
                        <div className="text-sm text-foreground-secondary">Overall Quality Score</div>
                      </div>
                    </div>

                    {/* Individual Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-background-surface/60 rounded-lg p-4">
                        <div className="text-2xl font-bold text-foreground-primary mb-1">{aiAnalysis.diversity}%</div>
                        <div className="text-xs text-foreground-secondary">Diversity</div>
                      </div>
                      <div className="bg-background-surface/60 rounded-lg p-4">
                        <div className="text-2xl font-bold text-foreground-primary mb-1">{aiAnalysis.accuracy}%</div>
                        <div className="text-xs text-foreground-secondary">Accuracy</div>
                      </div>
                      <div className="bg-background-surface/60 rounded-lg p-4">
                        <div className="text-2xl font-bold text-foreground-primary mb-1">{aiAnalysis.completeness}%</div>
                        <div className="text-xs text-foreground-secondary">Completeness</div>
                      </div>
                      <div className="bg-background-surface/60 rounded-lg p-4">
                        <div className="text-2xl font-bold text-foreground-primary mb-1">{aiAnalysis.consistency}%</div>
                        <div className="text-xs text-foreground-secondary">Consistency</div>
                      </div>
                      <div className="bg-background-surface/60 rounded-lg p-4">
                        <div className={`text-2xl font-bold mb-1 ${
                          aiAnalysis.bias === 'low' ? 'text-accent-green' :
                          aiAnalysis.bias === 'medium' ? 'text-accent-orange' :
                          'text-red-500'
                        }`}>
                          {aiAnalysis.bias.toUpperCase()}
                        </div>
                        <div className="text-xs text-foreground-secondary">Bias Level</div>
                      </div>
                      <div className="bg-background-surface/60 rounded-lg p-4">
                        <div className="text-2xl font-bold text-foreground-primary mb-1">{aiAnalysis.statistics.totalRecords.toLocaleString()}</div>
                        <div className="text-xs text-foreground-secondary">Records</div>
                      </div>
                    </div>

                    {/* Insights */}
                    {aiAnalysis.insights.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-bold text-foreground-primary mb-3">Key Insights</h4>
                        <div className="space-y-2">
                          {aiAnalysis.insights.map((insight, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm text-foreground-secondary">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-pink mt-0.5 flex-shrink-0">
                                <polyline points="9 11 12 14 22 4"/>
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                              </svg>
                              <span>{insight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {aiAnalysis.recommendations.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-bold text-foreground-primary mb-3">Recommendations</h4>
                        <div className="space-y-2">
                          {aiAnalysis.recommendations.map((rec, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm text-foreground-secondary">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-orange mt-0.5 flex-shrink-0">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M12 16v-4"/>
                                <path d="M12 8h.01"/>
                              </svg>
                              <span>{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Generate Certificate Section */}
                    {!mintedNFT ? (
                      <div className="space-y-4">
                        {/* Dataset Title Input */}
                        <div>
                          <label htmlFor="datasetTitle" className="block text-sm font-semibold text-foreground-primary mb-2">
                            Dataset Title (required for NFT) *
                          </label>
                          <input
                            type="text"
                            id="datasetTitle"
                            value={datasetTitle}
                            onChange={(e) => setDatasetTitle(e.target.value)}
                            placeholder="e.g., Healthcare Patient Records 2024"
                            className="w-full px-4 py-3 bg-background-surface border border-accent-pink/30 rounded-lg text-foreground-primary placeholder-foreground-tertiary focus:outline-none focus:border-accent-pink transition-colors"
                            maxLength={100}
                          />
                          <p className="text-xs text-foreground-tertiary mt-1">
                            This title will be stored on-chain with the NFT certificate
                          </p>
                        </div>

                        {/* Mint NFT Button */}
                        <button
                          onClick={handleMintNFT}
                          disabled={isMinting || !datasetTitle.trim()}
                          className="w-full px-6 py-3 bg-gradient-to-r from-accent-pink to-accent-magenta text-white rounded-lg font-bold hover:shadow-glow-pink transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isMinting ? (
                            <>
                              <div className="animate-spin">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                                </svg>
                              </div>
                              Minting NFT Certificate...
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="8" r="6"/>
                                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
                              </svg>
                              Generate NFT Certificate
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      /* NFT Minted Success */
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-accent-green/10 border border-accent-green/30 rounded-xl p-6"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-full bg-accent-green/20 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-green">
                              <circle cx="12" cy="8" r="6"/>
                              <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-accent-green">NFT Certificate Minted! 🎉</h3>
                            <p className="text-sm text-foreground-secondary">Your dataset quality certificate is now on-chain</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {/* Transaction Link */}
                          <a
                            href={getExplorerUrl(mintedNFT.digest, 'testnet')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 bg-background-base/50 rounded-lg hover:bg-background-base transition-colors group"
                          >
                            <div className="flex-1">
                              <span className="text-xs text-foreground-secondary">Transaction</span>
                              <p className="text-sm text-foreground-primary font-mono truncate">{mintedNFT.digest}</p>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-pink group-hover:translate-x-1 transition-transform">
                              <path d="M7 17L17 7"/>
                              <path d="M7 7h10v10"/>
                            </svg>
                          </a>

                          {/* NFT ID Link (if available) */}
                          {mintedNFT.nftId && (
                            <a
                              href={getNFTExplorerUrl(mintedNFT.nftId, 'testnet')}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 bg-background-base/50 rounded-lg hover:bg-background-base transition-colors group"
                            >
                              <div className="flex-1">
                                <span className="text-xs text-foreground-secondary">NFT Object</span>
                                <p className="text-sm text-foreground-primary font-mono truncate">{mintedNFT.nftId}</p>
                              </div>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-pink group-hover:translate-x-1 transition-transform">
                                <path d="M7 17L17 7"/>
                                <path d="M7 7h10v10"/>
                              </svg>
                            </a>
                          )}
                        </div>

                        <p className="text-xs text-foreground-tertiary mt-4 text-center">
                          ✅ Title: <strong>{datasetTitle}</strong> | ⭐ Score: <strong>{aiAnalysis.qualityScore}/100</strong> stored on Sui blockchain
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>
            )}

            <p className="text-sm text-foreground-tertiary mb-8">
              <strong>What happens next:</strong> Your dataset will be uploaded to Walrus decentralized storage with permanent storage.
              After upload, you'll receive a Blob ID that can be used to access your file.
            </p>

            {!uploadComplete && (
              <button
                onClick={handleStartUpload}
                disabled={!uploadedFile || isUploading || !currentAccount}
                className="px-8 py-4 bg-accent-pink text-white rounded-full font-semibold hover:bg-accent-magenta hover:shadow-glow-pink transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading to Walrus...' : 'Start Upload Process'}
              </button>
            )}
          </motion.div>
        </div>
      </main>
    </>
  );
}
