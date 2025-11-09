'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { walrusService } from '@/lib/walrus/walrusService';
import { useToast } from '@/lib/context/ToastContext';

export default function BlobViewerPage() {
  const [blobId, setBlobId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [blobData, setBlobData] = useState<{
    blob: Blob;
    url: string;
    size: number;
    type: string;
  } | null>(null);
  const { showToast } = useToast();

  const handleRetrieve = async () => {
    if (!blobId.trim()) {
      showToast('Please enter a Blob ID', 'warning');
      return;
    }

    setIsLoading(true);
    setBlobData(null);

    try {
      showToast('Retrieving blob from Walrus...', 'info');

      const blob = await walrusService.retrieveBlob(blobId.trim());

      if (blob) {
        const url = URL.createObjectURL(blob);
        setBlobData({
          blob,
          url,
          size: blob.size,
          type: blob.type || 'application/octet-stream'
        });
        showToast('Blob retrieved successfully!', 'success');
      } else {
        throw new Error('Blob not found or retrieval failed');
      }
    } catch (error) {
      console.error('Retrieval error:', error);
      showToast(error instanceof Error ? error.message : 'Failed to retrieve blob', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (blobData) {
      const a = document.createElement('a');
      a.href = blobData.url;
      a.download = `blob-${blobId}.${getFileExtension(blobData.type)}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('Download started', 'success');
    }
  };

  const getFileExtension = (mimeType: string): string => {
    const extensions: { [key: string]: string } = {
      'application/json': 'json',
      'text/csv': 'csv',
      'application/zip': 'zip',
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/gif': 'gif',
      'video/mp4': 'mp4',
      'audio/mpeg': 'mp3',
    };
    return extensions[mimeType] || 'bin';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const isImage = blobData?.type.startsWith('image/');
  const isVideo = blobData?.type.startsWith('video/');
  const isAudio = blobData?.type.startsWith('audio/');
  const isText = blobData?.type.startsWith('text/') || blobData?.type === 'application/json';

  return (
    <main className="min-h-screen bg-background-base pt-24">
      <div className="container-center py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent-pink to-accent-magenta flex items-center justify-center shadow-glow-pink">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <h1 className="font-display text-5xl font-bold text-foreground-primary mb-4">
              Blob Viewer
            </h1>
            <p className="text-xl text-foreground-secondary">
              Enter a Blob ID to retrieve and view files from Walrus
            </p>
          </div>

          {/* Input Section */}
          <div className="bg-background-elevated/60 backdrop-blur-2xl border border-accent-pink/20 rounded-2xl p-8 mb-8">
            <label className="block text-sm font-semibold text-foreground-primary mb-3">
              Blob ID
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={blobId}
                onChange={(e) => setBlobId(e.target.value)}
                placeholder="Enter Walrus Blob ID (e.g., abcd1234...)"
                className="flex-1 px-4 py-3 bg-background-surface border border-border-DEFAULT rounded-xl text-foreground-primary placeholder:text-foreground-tertiary focus:outline-none focus:border-accent-pink transition-colors"
                disabled={isLoading}
              />
              <button
                onClick={handleRetrieve}
                disabled={isLoading || !blobId.trim()}
                className="px-6 py-3 bg-accent-pink text-white rounded-xl font-semibold hover:bg-accent-magenta hover:shadow-glow-pink transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Loading...' : 'Retrieve'}
              </button>
            </div>
            <p className="text-xs text-foreground-tertiary mt-2">
              This is an admin tool for testing Walrus storage integration
            </p>
          </div>

          {/* Results Section */}
          {blobData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background-elevated/60 backdrop-blur-2xl border border-accent-green/20 rounded-2xl p-8"
            >
              {/* Metadata */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-border-subtle">
                <div>
                  <h3 className="text-lg font-bold text-foreground-primary mb-2">Blob Retrieved</h3>
                  <div className="flex gap-4 text-sm text-foreground-secondary">
                    <span>Size: <strong>{formatFileSize(blobData.size)}</strong></span>
                    <span>Type: <strong>{blobData.type}</strong></span>
                  </div>
                </div>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-accent-pink text-white rounded-lg font-semibold hover:bg-accent-magenta transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" x2="12" y1="15" y2="3"/>
                  </svg>
                  Download
                </button>
              </div>

              {/* Preview */}
              <div className="bg-background-surface rounded-xl p-6">
                <h4 className="text-sm font-semibold text-foreground-secondary mb-4">Preview</h4>
                
                {isImage && (
                  <div className="flex justify-center">
                    <img 
                      src={blobData.url} 
                      alt="Blob preview" 
                      className="max-w-full max-h-96 rounded-lg"
                    />
                  </div>
                )}

                {isVideo && (
                  <video 
                    src={blobData.url} 
                    controls 
                    className="w-full rounded-lg"
                  />
                )}

                {isAudio && (
                  <audio 
                    src={blobData.url} 
                    controls 
                    className="w-full"
                  />
                )}

                {isText && (
                  <div className="bg-background-base rounded-lg p-4 max-h-96 overflow-auto">
                    <pre className="text-sm text-foreground-primary font-mono whitespace-pre-wrap break-words">
                      {/* Text content will be loaded here if needed */}
                      <span className="text-foreground-tertiary">
                        Text preview - download the file to view full content
                      </span>
                    </pre>
                  </div>
                )}

                {!isImage && !isVideo && !isAudio && !isText && (
                  <div className="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-foreground-tertiary">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <p className="text-foreground-secondary">
                      Preview not available for this file type
                    </p>
                    <p className="text-sm text-foreground-tertiary mt-2">
                      Click the download button to save the file
                    </p>
                  </div>
                )}
              </div>

              {/* Walrus URL */}
              <div className="mt-6 pt-6 border-t border-border-subtle">
                <label className="block text-xs font-semibold text-foreground-secondary mb-2">
                  Direct Walrus URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={walrusService.getBlobUrl(blobId)}
                    readOnly
                    className="flex-1 px-3 py-2 bg-background-base border border-border-DEFAULT rounded-lg text-xs text-foreground-primary font-mono"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(walrusService.getBlobUrl(blobId));
                      showToast('URL copied!', 'success');
                    }}
                    className="px-3 py-2 bg-background-surface text-foreground-primary rounded-lg text-xs font-semibold hover:bg-background-elevated transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
