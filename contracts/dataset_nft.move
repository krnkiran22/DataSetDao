/// Dataset Quality Certificate NFT Contract
/// Mints NFTs when datasets are uploaded to Walrus storage with AI quality scores
/// NFT metadata includes dataset title, AI quality score, blob ID, and timestamp
module datasetdao::dataset_nft {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;
    use sui::url::{Self, Url};
    use sui::display;
    use sui::package;
    use std::string::{Self, String};
    use sui::clock::{Self, Clock};

    // Error codes
    const EInvalidBlobId: u64 = 1;
    const EEmptyTitle: u64 = 2;
    const EInvalidScore: u64 = 3;
    const EInvalidImageUrl: u64 = 4;

    /// Dataset Quality Certificate NFT
    public struct DatasetNFT has key, store {
        id: UID,
        /// Title of the dataset provided by user
        dataset_title: String,
        /// AI-generated quality score (0-100)
        quality_score: u64,
        /// Diversity score (0-100)
        diversity_score: u64,
        /// Accuracy score (0-100)
        accuracy_score: u64,
        /// Completeness score (0-100)
        completeness_score: u64,
        /// Consistency score (0-100)
        consistency_score: u64,
        /// Bias level (0=low, 1=medium, 2=high)
        bias_level: u8,
        /// Wallet address of the dataset owner
        owner_address: address,
        /// Blob ID from Walrus storage
        blob_id: String,
        /// Timestamp when dataset was uploaded and verified
        timestamp: u64,
        /// Custom image URL for the NFT (provided from frontend)
        image_url: Url,
        /// MIME type of the dataset (e.g., "application/json", "text/csv")
        dataset_type: String,
        /// Size of the dataset in bytes
        dataset_size: u64,
        /// Total number of records in the dataset
        total_records: u64,
    }

    /// One-time witness for creating Display
    public struct DATASET_NFT has drop {}

    // Events
    public struct NFTMinted has copy, drop {
        nft_id: ID,
        dataset_title: String,
        quality_score: u64,
        blob_id: String,
        owner: address,
        timestamp: u64,
    }

    public struct QualityScoreRecorded has copy, drop {
        nft_id: ID,
        dataset_title: String,
        quality_score: u64,
        diversity_score: u64,
        accuracy_score: u64,
        completeness_score: u64,
        consistency_score: u64,
        bias_level: u8,
    }

    /// Initialize function to set up the NFT display
    fun init(otw: DATASET_NFT, ctx: &mut TxContext) {
        let keys = vector[
            string::utf8(b"name"),
            string::utf8(b"description"),
            string::utf8(b"image_url"),
            string::utf8(b"dataset_title"),
            string::utf8(b"quality_score"),
            string::utf8(b"diversity_score"),
            string::utf8(b"accuracy_score"),
            string::utf8(b"completeness_score"),
            string::utf8(b"consistency_score"),
            string::utf8(b"bias_level"),
            string::utf8(b"blob_id"),
            string::utf8(b"timestamp"),
            string::utf8(b"dataset_type"),
            string::utf8(b"total_records"),
        ];

        let values = vector[
            string::utf8(b"Dataset Quality Certificate: {dataset_title}"),
            string::utf8(b"This NFT certifies the quality and authenticity of dataset '{dataset_title}' uploaded to Walrus decentralized storage. Quality Score: {quality_score}/100 | Blob ID: {blob_id} | Verified: {timestamp}"),
            string::utf8(b"{image_url}"),
            string::utf8(b"{dataset_title}"),
            string::utf8(b"{quality_score}/100"),
            string::utf8(b"{diversity_score}%"),
            string::utf8(b"{accuracy_score}%"),
            string::utf8(b"{completeness_score}%"),
            string::utf8(b"{consistency_score}%"),
            string::utf8(b"{bias_level}"),
            string::utf8(b"{blob_id}"),
            string::utf8(b"{timestamp}"),
            string::utf8(b"{dataset_type}"),
            string::utf8(b"{total_records} records"),
        ];

        let publisher = package::claim(otw, ctx);
        let mut display = display::new_with_fields<DatasetNFT>(
            &publisher, keys, values, ctx
        );

        display::update_version(&mut display);

        transfer::public_transfer(publisher, tx_context::sender(ctx));
        transfer::public_transfer(display, tx_context::sender(ctx));
    }

    /// Mint a new Dataset Quality Certificate NFT with AI scores
    /// This is the main function to call from frontend
    public entry fun mint_certificate_nft(
        dataset_title: String,
        quality_score: u64,
        diversity_score: u64,
        accuracy_score: u64,
        completeness_score: u64,
        consistency_score: u64,
        bias_level: u8,
        blob_id: String,
        image_url_bytes: vector<u8>,
        dataset_type: String,
        dataset_size: u64,
        total_records: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Validation
        assert!(!string::is_empty(&dataset_title), EEmptyTitle);
        assert!(!string::is_empty(&blob_id), EInvalidBlobId);
        assert!(quality_score <= 100, EInvalidScore);
        assert!(diversity_score <= 100, EInvalidScore);
        assert!(accuracy_score <= 100, EInvalidScore);
        assert!(completeness_score <= 100, EInvalidScore);
        assert!(consistency_score <= 100, EInvalidScore);
        assert!(bias_level <= 2, EInvalidScore); // 0=low, 1=medium, 2=high

        let timestamp = clock::timestamp_ms(clock);
        let owner = tx_context::sender(ctx);
        
        // Create image URL from bytes provided by frontend
        let image_url = url::new_unsafe_from_bytes(image_url_bytes);

        let nft = DatasetNFT {
            id: object::new(ctx),
            dataset_title,
            quality_score,
            diversity_score,
            accuracy_score,
            completeness_score,
            consistency_score,
            bias_level,
            owner_address: owner,
            blob_id,
            timestamp,
            image_url,
            dataset_type,
            dataset_size,
            total_records,
        };

        let nft_id = object::id(&nft);

        // Emit events
        event::emit(NFTMinted {
            nft_id,
            dataset_title: nft.dataset_title,
            quality_score: nft.quality_score,
            blob_id: nft.blob_id,
            owner,
            timestamp,
        });

        event::emit(QualityScoreRecorded {
            nft_id,
            dataset_title: nft.dataset_title,
            quality_score: nft.quality_score,
            diversity_score: nft.diversity_score,
            accuracy_score: nft.accuracy_score,
            completeness_score: nft.completeness_score,
            consistency_score: nft.consistency_score,
            bias_level: nft.bias_level,
        });

        // Transfer the NFT to the sender (dataset uploader)
        transfer::public_transfer(nft, owner);
    }

    /// Store dataset metadata and scores on-chain (alternative function)
    /// Returns the created NFT for further processing if needed
    public fun create_certificate(
        dataset_title: String,
        quality_score: u64,
        diversity_score: u64,
        accuracy_score: u64,
        completeness_score: u64,
        consistency_score: u64,
        bias_level: u8,
        blob_id: String,
        image_url_bytes: vector<u8>,
        dataset_type: String,
        dataset_size: u64,
        total_records: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ): DatasetNFT {
        // Validation
        assert!(!string::is_empty(&dataset_title), EEmptyTitle);
        assert!(!string::is_empty(&blob_id), EInvalidBlobId);
        assert!(quality_score <= 100, EInvalidScore);

        let timestamp = clock::timestamp_ms(clock);
        let owner = tx_context::sender(ctx);
        let image_url = url::new_unsafe_from_bytes(image_url_bytes);

        let nft = DatasetNFT {
            id: object::new(ctx),
            dataset_title,
            quality_score,
            diversity_score,
            accuracy_score,
            completeness_score,
            consistency_score,
            bias_level,
            owner_address: owner,
            blob_id,
            timestamp,
            image_url,
            dataset_type,
            dataset_size,
            total_records,
        };

        let nft_id = object::id(&nft);

        // Emit events
        event::emit(NFTMinted {
            nft_id,
            dataset_title: nft.dataset_title,
            quality_score: nft.quality_score,
            blob_id: nft.blob_id,
            owner,
            timestamp,
        });

        event::emit(QualityScoreRecorded {
            nft_id,
            dataset_title: nft.dataset_title,
            quality_score: nft.quality_score,
            diversity_score: nft.diversity_score,
            accuracy_score: nft.accuracy_score,
            completeness_score: nft.completeness_score,
            consistency_score: nft.consistency_score,
            bias_level: nft.bias_level,
        });

        nft
    }

    // ===== Getter Functions =====

    /// Get all NFT metadata
    public fun get_full_metadata(nft: &DatasetNFT): (
        String, u64, u64, u64, u64, u64, u8, String, u64, u64
    ) {
        (
            nft.dataset_title,
            nft.quality_score,
            nft.diversity_score,
            nft.accuracy_score,
            nft.completeness_score,
            nft.consistency_score,
            nft.bias_level,
            nft.blob_id,
            nft.timestamp,
            nft.total_records
        )
    }

    /// Get dataset title
    public fun get_dataset_title(nft: &DatasetNFT): String {
        nft.dataset_title
    }

    /// Get quality score
    public fun get_quality_score(nft: &DatasetNFT): u64 {
        nft.quality_score
    }

    /// Get all scores
    public fun get_all_scores(nft: &DatasetNFT): (u64, u64, u64, u64, u64, u8) {
        (
            nft.quality_score,
            nft.diversity_score,
            nft.accuracy_score,
            nft.completeness_score,
            nft.consistency_score,
            nft.bias_level
        )
    }

    /// Get blob ID
    public fun get_blob_id(nft: &DatasetNFT): String {
        nft.blob_id
    }

    /// Get owner address
    public fun get_owner_address(nft: &DatasetNFT): address {
        nft.owner_address
    }

    /// Get timestamp
    public fun get_timestamp(nft: &DatasetNFT): u64 {
        nft.timestamp
    }

    /// Get image URL
    public fun get_image_url(nft: &DatasetNFT): Url {
        nft.image_url
    }

    /// Get dataset type
    public fun get_dataset_type(nft: &DatasetNFT): String {
        nft.dataset_type
    }

    /// Get dataset size
    public fun get_dataset_size(nft: &DatasetNFT): u64 {
        nft.dataset_size
    }

    /// Get total records
    public fun get_total_records(nft: &DatasetNFT): u64 {
        nft.total_records
    }

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(DATASET_NFT {}, ctx);
    }
}
