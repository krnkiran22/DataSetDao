# Quick Error Summary

## The Problem

❌ **Error:** `RangeError: Invalid array length` when minting NFT on Sui blockchain

## Where It Fails

```typescript
// Line 87 in nftService.ts
tx.pure(serializedImageBytes); // ❌ Fails here during BCS encoding
```

## Contract Expects (Move)

```move
image_url_bytes: vector<u8>   // Expects byte array
```

## What We're Trying

```typescript
// Convert string to bytes
const imageUrl =
  "https://ipfs.io/ipfs/QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx";
const imageUrlBytes = new Uint8Array(new TextEncoder().encode(imageUrl));

// Serialize using BCS
const serializedImageBytes = bcs
  .vector(bcs.U8)
  .serialize(Array.from(imageUrlBytes))
  .toBytes();

// Pass to contract - FAILS HERE ❌
tx.pure(serializedImageBytes);
```

## Error Stack

```
RangeError: Invalid array length
    at ulebEncode (uleb.ts:15:10)
    at BcsWriter.writeVec (writer.ts:157:8)
    at Object.Pure (Inputs.ts:54:11)
    at nftService.ts:87:14  // Our code
```

## Files to Review

1. `/contracts/sources/dataset_nft.move` - Move contract (line 146)
2. `/lib/contract/nftService.ts` - TypeScript code (line 87)
3. `/ERROR_SUMMARY_FOR_CLAUDE.md` - Full details

## The Question

**How do we correctly pass `vector<u8>` from TypeScript to Sui Move contract?**

All other parameters work (strings, numbers, objects) - only `vector<u8>` fails.

## Dependencies

- @mysten/sui.js: v0.54.1
- @mysten/dapp-kit: v0.19.8
- Network: Sui Devnet
