# NFT Minting Error - Complete Problem Summary

## Current Error

```
Error preparing transaction: RangeError: Invalid array length
    at ulebEncode (uleb.ts:15:10)
    at BcsWriter.writeULEB (writer.ts:145:3)
    at BcsWriter.writeVec (writer.ts:157:8)
```

**Error Location:** Line 87 in nftService.ts when calling `tx.pure()` for the `image_url_bytes` parameter

---

## The Problem

We're trying to mint an NFT on Sui blockchain that includes an image URL. The Move contract expects `image_url_bytes: vector<u8>`, but when we try to pass this parameter from TypeScript, we get an "Invalid array length" error during BCS (Binary Canonical Serialization) encoding.

---

## Move Contract Signature

**File:** `/contracts/sources/dataset_nft.move`

```move
public entry fun mint_certificate_nft(
    dataset_title: String,           // 1. ✅ Working
    quality_score: u64,              // 2. ✅ Working
    diversity_score: u64,            // 3. ✅ Working
    accuracy_score: u64,             // 4. ✅ Working
    completeness_score: u64,         // 5. ✅ Working
    consistency_score: u64,          // 6. ✅ Working
    bias_level: u8,                  // 7. ✅ Working
    blob_id: String,                 // 8. ✅ Working
    image_url_bytes: vector<u8>,     // 9. ❌ FAILING - This is the problem
    dataset_type: String,            // 10. ✅ Working
    dataset_size: u64,               // 11. ✅ Working
    total_records: u64,              // 12. ✅ Working
    clock: &Clock,                   // 13. ✅ Working
    ctx: &mut TxContext
)
```

**What the contract does with `image_url_bytes`:**

```move
let image_url = url::new_unsafe_from_bytes(image_url_bytes);
```

---

## TypeScript Code (Current - Failing)

**File:** `/lib/contract/nftService.ts`

```typescript
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { bcs } from "@mysten/sui.js/bcs";

const DEFAULT_NFT_IMAGE =
  "https://ipfs.io/ipfs/QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx";

// Current approach (FAILING at line 87):
const imageUrl = metadata.imageUrl || DEFAULT_NFT_IMAGE;
const imageUrlString = imageUrl.substring(0, 500); // Limited to 500 chars
const imageUrlBytes = new Uint8Array(new TextEncoder().encode(imageUrlString));

console.log("🔢 Image URL bytes length:", imageUrlBytes.length); // Shows ~70 bytes

// Manual BCS serialization
const serializedImageBytes = bcs
  .vector(bcs.U8)
  .serialize(Array.from(imageUrlBytes))
  .toBytes();

// Building transaction
tx.moveCall({
  target: `${PACKAGE_ID}::${MODULE_NAME}::mint_certificate_nft`,
  arguments: [
    tx.pure(metadata.title, "string"), // ✅ Works
    tx.pure(metadata.qualityScore, "u64"), // ✅ Works
    tx.pure(metadata.diversityScore, "u64"), // ✅ Works
    tx.pure(metadata.accuracyScore, "u64"), // ✅ Works
    tx.pure(metadata.completenessScore, "u64"), // ✅ Works
    tx.pure(metadata.consistencyScore, "u64"), // ✅ Works
    tx.pure(biasLevelToNumber(metadata.biasLevel), "u8"), // ✅ Works
    tx.pure(metadata.blobId, "string"), // ✅ Works
    tx.pure(serializedImageBytes), // ❌ FAILS HERE - Line 87
    tx.pure(metadata.datasetType, "string"), // Never reached
    tx.pure(metadata.datasetSize, "u64"), // Never reached
    tx.pure(metadata.totalRecords, "u64"), // Never reached
    tx.object(CLOCK_OBJECT_ID), // Never reached
  ],
});
```

---

## Attempted Solutions (All Failed)

### Attempt 1: Direct Array

```typescript
const imageUrlBytes = Array.from(new TextEncoder().encode(imageUrl));
tx.pure(imageUrlBytes, "vector<u8>");
```

**Result:** ❌ Invalid array length

### Attempt 2: Uint8Array

```typescript
const imageUrlBytes = new Uint8Array(new TextEncoder().encode(imageUrl));
tx.pure(imageUrlBytes, "vector<u8>");
```

**Result:** ❌ Invalid array length

### Attempt 3: Spread Uint8Array

```typescript
const imageUrlBytes = new Uint8Array(new TextEncoder().encode(imageUrl));
tx.pure([...imageUrlBytes], "vector<u8>");
```

**Result:** ❌ Invalid array length

### Attempt 4: BCS Manual Serialization

```typescript
const serializedImageBytes = bcs
  .vector(bcs.u8())
  .serialize(imageUrlBytes)
  .toBytes();
tx.pure(serializedImageBytes);
```

**Result:** ❌ Invalid array length (current approach)

### Attempt 5: BCS with U8 (capital)

```typescript
const serializedImageBytes = bcs
  .vector(bcs.U8)
  .serialize(Array.from(imageUrlBytes))
  .toBytes();
tx.pure(serializedImageBytes);
```

**Result:** ❌ Invalid array length (current approach)

---

## Dependencies

```json
{
  "@mysten/dapp-kit": "^0.19.8",
  "@mysten/sui.js": "^0.54.1"
}
```

---

## Stack Trace Detail

```
RangeError: Invalid array length
    at ulebEncode (uleb.ts:15:10)              // ULEB128 encoding
    at BcsWriter.writeULEB (writer.ts:145:3)   // Writing unsigned LEB
    at BcsWriter.writeVec (writer.ts:157:8)    // Writing vector length
    at _BCS.<anonymous> (legacy-registry.ts:1083:18)
    at _BCS._encodeRaw (legacy-registry.ts:374:22)
    at Object.encode (legacy-registry.ts:360:28)
    at _BCS.ser (legacy-registry.ts:232:39)
    at Object.Pure (Inputs.ts:54:11)           // TransactionBlock.pure()
    at TransactionBlock.ts:254:16
    at _TransactionBlock.pure (pure.ts:39:10)
    at nftService.ts:87:14                     // Our code - tx.pure(serializedImageBytes)
```

The error happens **during BCS encoding** when trying to write the vector length using ULEB128 encoding.

---

## Additional Context

### Image URL Being Passed

- Default: `https://ipfs.io/ipfs/QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx`
- Length: ~70 characters
- Bytes: ~70 bytes (after UTF-8 encoding)
- Limited to 500 chars max in current code

### Other Parameters Working

All other parameters (strings, u64, u8) work perfectly:

- Strings: `dataset_title`, `blob_id`, `dataset_type`
- Numbers: `quality_score`, `diversity_score`, etc.
- Object reference: `clock: &Clock`

**Only `vector<u8>` is failing.**

---

## Possible Root Causes

1. **BCS Serialization Issue**: The way we're pre-serializing the vector might be creating invalid BCS format
2. **Type Mismatch**: TransactionBlock might be trying to double-serialize already serialized bytes
3. **ULEB128 Encoding**: The vector length encoding is failing, suggesting the length value itself is invalid
4. **API Version Mismatch**: @mysten/sui.js v0.54.1 with @mysten/dapp-kit v0.19.8 might have compatibility issues

---

## What We Need

**Question for Claude Pro:**

How do we correctly pass a `vector<u8>` parameter to a Sui Move contract using TypeScript with `@mysten/sui.js` v0.54.1?

Specifically:

1. How to properly serialize a string to `vector<u8>` for Sui Move?
2. What's the correct `tx.pure()` syntax for `vector<u8>`?
3. Is there a better way to pass the image URL to the contract?

**Alternative Question:**

Should we modify the Move contract to accept `String` instead of `vector<u8>` for the image URL? If yes, how would that change the contract code?

---

## Contract Deployment Info

- **Package ID:** `0xb3e4accc5e4642f064a21efe496dc920b0dda33b86b4d252679ec5383e19bd00`
- **Network:** Sui Devnet
- **Module:** `dataset_nft`
- **Function:** `mint_certificate_nft`

---

## Expected Behavior

When working correctly:

1. User uploads dataset → Gets AI quality scores
2. User enters dataset title
3. Clicks "Generate NFT Certificate"
4. Transaction builds with all 13 parameters
5. Wallet shows transaction for approval
6. User approves → NFT mints on Sui blockchain
7. NFT includes image URL stored on-chain
8. NFT appears in user's wallet

**Currently failing at step 4** when building the transaction.

---

## Question Summary

**We need help with:**

1. Correct way to pass `vector<u8>` to Sui Move contract from TypeScript
2. Why ULEB encoding is failing for vector length
3. Alternative approaches (modify contract to use String instead?)
4. Working example of passing byte arrays to Sui Move contracts

Please provide working code examples that will resolve this RangeError.
