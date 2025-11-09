/**
 * Dataset NFT Certificate Minting Service
 * Interacts with Sui smart contract to mint NFTs with AI quality scores
 */

import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SuiClient } from '@mysten/sui.js/client';

// ✅ CONTRACT DEPLOYED ON SUI DEVNET
const PACKAGE_ID: string = '0xb3e4accc5e4642f064a21efe496dc920b0dda33b86b4d252679ec5383e19bd00';
const MODULE_NAME = 'dataset_nft';
const CLOCK_OBJECT_ID = '0x6'; // Sui Clock object (fixed address)

// Default NFT image URL (you can change this from frontend)
const DEFAULT_NFT_IMAGE = 'https://imgs.search.brave.com/-9LoRSi_lck1m78j6cS-DZIFsw4dv5FvVk-72jFP2nE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/ZGl4LmNvbS9sb2dv/LzIwNTgyMjcuanBn';

export interface DatasetMetadata {
  title: string;
  qualityScore: number;
  diversityScore: number;
  accuracyScore: number;
  completenessScore: number;
  consistencyScore: number;
  biasLevel: 'low' | 'medium' | 'high';
  blobId: string;
  datasetType: string;
  datasetSize: number;
  totalRecords: number;
  imageUrl?: string; // Optional custom image
}

export interface MintResult {
  success: boolean;
  transactionDigest?: string;
  nftId?: string;
  error?: string;
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
 * Mint Dataset Quality Certificate NFT
 * 
 * @param metadata - Dataset metadata including title, scores, and blob ID
 * @param signAndExecute - Function from @mysten/dapp-kit to sign and execute transaction
 * @returns Promise with mint result
 */
export async function mintDatasetCertificate(
  metadata: DatasetMetadata,
  signAndExecute: any // SignAndExecuteTransactionBlock from useSignAndExecuteTransactionBlock
): Promise<MintResult> {
  try {
    console.log('🎨 Preparing NFT mint transaction...');
    console.log('📋 Dataset Title:', metadata.title);
    console.log('⭐ Quality Score:', metadata.qualityScore);
    console.log('🆔 Blob ID:', metadata.blobId);

    if (!PACKAGE_ID || PACKAGE_ID === 'YOUR_DEPLOYED_PACKAGE_ID_HERE') {
      throw new Error('Contract not deployed yet. Please deploy the contract and update PACKAGE_ID in nftService.ts');
    }

    // Create transaction block
    const txb = new TransactionBlock();

    // Convert image URL to bytes
    const imageUrl = metadata.imageUrl || DEFAULT_NFT_IMAGE;
    const imageUrlBytes = Array.from(new TextEncoder().encode(imageUrl));

    // Call the mint_certificate_nft function
    txb.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::mint_certificate_nft`,
      arguments: [
        txb.pure(metadata.title), // dataset_title: String
        txb.pure(metadata.qualityScore), // quality_score: u64
        txb.pure(metadata.diversityScore), // diversity_score: u64
        txb.pure(metadata.accuracyScore), // accuracy_score: u64
        txb.pure(metadata.completenessScore), // completeness_score: u64
        txb.pure(metadata.consistencyScore), // consistency_score: u64
        txb.pure(biasLevelToNumber(metadata.biasLevel)), // bias_level: u8
        txb.pure(metadata.blobId), // blob_id: String
        txb.pure(imageUrlBytes), // image_url_bytes: vector<u8>
        txb.pure(metadata.datasetType), // dataset_type: String
        txb.pure(metadata.datasetSize), // dataset_size: u64
        txb.pure(metadata.totalRecords), // total_records: u64
        txb.object(CLOCK_OBJECT_ID), // clock: &Clock
      ],
    });

    console.log('📤 Sending transaction to Sui network...');

    // Sign and execute transaction
    const result = await signAndExecute(
      {
        transactionBlock: txb,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      },
      {
        onSuccess: (tx: any) => {
          console.log('✅ Transaction successful:', tx.digest);
        },
        onError: (error: any) => {
          console.error('❌ Transaction failed:', error);
        },
      }
    );

    if (!result || !result.digest) {
      throw new Error('Transaction failed - no digest returned');
    }

    // Find the created NFT object
    let nftId = undefined;
    if (result.objectChanges) {
      const createdObject = result.objectChanges.find(
        (change: any) => change.type === 'created' && change.objectType?.includes('DatasetNFT')
      );
      if (createdObject) {
        nftId = createdObject.objectId;
        console.log('🎉 NFT Created! ID:', nftId);
      }
    }

    return {
      success: true,
      transactionDigest: result.digest,
      nftId,
    };
  } catch (error) {
    console.error('❌ Error minting NFT:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get Sui Explorer URL for transaction
 */
export function getExplorerUrl(digest: string, network: 'testnet' | 'mainnet' | 'devnet' = 'devnet'): string {
  return `https://suiscan.xyz/${network}/tx/${digest}`;
}

/**
 * Get Sui Explorer URL for NFT object
 */
export function getNFTExplorerUrl(objectId: string, network: 'testnet' | 'mainnet' | 'devnet' = 'devnet'): string {
  return `https://suiscan.xyz/${network}/object/${objectId}`;
}

/**
 * Check if contract is deployed and configured
 */
export function isContractConfigured(): boolean {
  return PACKAGE_ID !== 'YOUR_DEPLOYED_PACKAGE_ID_HERE' && PACKAGE_ID.length > 0;
}

/**
 * Get current package ID
 */
export function getPackageId(): string {
  return PACKAGE_ID;
}
