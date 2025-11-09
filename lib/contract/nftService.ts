/**
 * Dataset NFT Certificate Minting Service
 * Interacts with Sui smart contract to mint NFTs with AI quality scores
 * Using modern @mysten/sui v1.38.0 SDK
 */

import { Transaction } from '@mysten/sui/transactions';

// CONTRACT DEPLOYED ON SUI DEVNET - V4 (MINIMAL - No string params!)
// Transaction: 6YdmB5g5r1ZU3poKfDNjHFsR6yFXWtvUSRfr6D1zR7zM
// Uses mint_simple_certificate - only numeric parameters!
const PACKAGE_ID: string = '0x39b6bcf207724ea777226d38d13820f929b8c8b9ae055718715b9f50e3d6eac0';
const MODULE_NAME = 'dataset_nft';
const CLOCK_OBJECT_ID = '0x6'; // Sui Clock object (fixed address)

export interface DatasetMetadata {
  qualityScore: number;
  diversityScore: number;
  accuracyScore: number;
  completenessScore: number;
  consistencyScore: number;
  biasLevel: 'low' | 'medium' | 'high';
  datasetSize: number;
  totalRecords: number;
}

/**
 * Convert bias level string to number (0=low, 1=medium, 2=high)
 */
function biasLevelToNumber(bias: 'low' | 'medium' | 'high'): number {
  switch (bias) {
    case 'low':
      return 0;
    case 'medium':
      return 1;
    case 'high':
      return 2;
    default:
      return 0;
  }
}

/**
 * Build NFT mint transaction (NO STRINGS - only numbers!)
 * Returns Transaction directly for signing
 */
export function buildMintTransaction(metadata: DatasetMetadata): Transaction {
  console.log('🔨 Building simplified NFT mint transaction...');
  console.log('📊 Quality Score:', metadata.qualityScore);
  console.log('📊 Dataset Size:', metadata.datasetSize);
  console.log('📊 Total Records:', metadata.totalRecords);

  if (!PACKAGE_ID || PACKAGE_ID === 'YOUR_DEPLOYED_PACKAGE_ID_HERE') {
    throw new Error('Contract not deployed yet');
  }

  // Validate scores
  if (metadata.qualityScore > 100 || metadata.diversityScore > 100 ||
      metadata.accuracyScore > 100 || metadata.completenessScore > 100 ||
      metadata.consistencyScore > 100) {
    throw new Error('All scores must be between 0 and 100');
  }

  const tx = new Transaction();

  // Call the SIMPLE mint function - ONLY NUMBERS!
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::mint_simple_certificate`,
    arguments: [
      tx.pure.u64(metadata.qualityScore),
      tx.pure.u64(metadata.diversityScore),
      tx.pure.u64(metadata.accuracyScore),
      tx.pure.u64(metadata.completenessScore),
      tx.pure.u64(metadata.consistencyScore),
      tx.pure.u8(biasLevelToNumber(metadata.biasLevel)),
      tx.pure.u64(metadata.datasetSize),
      tx.pure.u64(metadata.totalRecords),
      tx.object(CLOCK_OBJECT_ID),
    ],
  });

  tx.setGasBudget(50_000_000); // 0.05 SUI

  console.log('✅ Transaction built successfully');
  console.log('🎯 Target:', `${PACKAGE_ID}::${MODULE_NAME}::mint_simple_certificate`);

  return tx; // Return directly, NOT wrapped in Promise!
}

export function getExplorerUrl(digest: string, network: 'testnet' | 'mainnet' | 'devnet' = 'devnet'): string {
  return `https://suiscan.xyz/${network}/tx/${digest}`;
}

export function getNFTExplorerUrl(objectId: string, network: 'testnet' | 'mainnet' | 'devnet' = 'devnet'): string {
  return `https://suiscan.xyz/${network}/object/${objectId}`;
}

export function isContractConfigured(): boolean {
  return PACKAGE_ID !== 'YOUR_DEPLOYED_PACKAGE_ID_HERE' && PACKAGE_ID.length > 0;
}

export function getPackageId(): string {
  return PACKAGE_ID;
}
