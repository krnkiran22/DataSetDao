# DatasetDAO

# DatasetDAO - AI-Verified Dataset Marketplace

A decentralized marketplace for high-quality, AI-verified datasets built on Sui blockchain with Walrus storage.

## 🌟 Features

### Core Functionality

- **📤 Dataset Upload**: Upload datasets (CSV, JSON, Parquet, etc.) to decentralized Walrus storage
- **🤖 AI Quality Analysis**: Automated quality assessment using Groq AI (LLaMA 3.3 70B)
- **🎨 NFT Certificates**: Mint blockchain certificates with quality scores on Sui
- **🛒 Marketplace**: Browse and discover AI-verified datasets
- **🔐 Wallet Integration**: Sui wallet support for secure transactions

### Technical Highlights

- **Decentralized Storage**: Walrus testnet with permanent storage (40+ publishers)
- **AI Evaluation**: Comprehensive analysis (quality, diversity, accuracy, completeness, consistency, bias)
- **Blockchain Verification**: Smart contracts on Sui devnet
- **Modern Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Sui Wallet (Chrome extension)
- Sui testnet tokens (get from faucet)

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd datasetdao

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Groq API key to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📦 Package Versions

```json
{
  "@mysten/sui": "^1.38.0",
  "@mysten/dapp-kit": "^0.18.0",
  "@mysten/seal": "^0.8.0"
}
```

## 🏗️ Architecture

### Smart Contract

- **Package ID**: `0x9b089b46018752195f260d485db1c1413d4af0841b61b37b293e542816f13fec`
- **Network**: Sui Devnet
- **Function**: `mint_simple_certificate` (numeric scores only)

### Walrus Storage

- **Publisher**: `https://publisher.testnet.walrus.atalma.io`
- **Aggregator**: `https://sui-walrus-tn-aggregator.bwarelabs.com`
- **Permanent Storage**: ✅ Enabled
- **Total Publishers**: 48

### AI Analysis

- **Provider**: Groq
- **Model**: llama-3.3-70b-versatile
- **Evaluation Metrics**:
  - Quality Score (0-100)
  - Diversity Score (0-100%)
  - Accuracy Score (0-100%)
  - Completeness Score (0-100%)
  - Consistency Score (0-100%)
  - Bias Level (Low/Medium/High)

## 📁 Project Structure

```
datasetdao/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Homepage
│   ├── upload/            # Dataset upload page
│   ├── marketplace/       # Browse datasets
│   └── dataset/[id]/      # Dataset details
├── components/            # React components
│   ├── features/          # Feature-specific components
│   └── layout/            # Layout components
├── lib/                   # Core utilities
│   ├── ai/               # Groq AI integration
│   ├── contract/         # Sui smart contract
│   ├── walrus/           # Walrus storage
│   └── wallet/           # Wallet provider
├── contracts/            # Move smart contracts
└── public/              # Static assets
```

## 🎯 Usage Guide

### 1. Connect Wallet

Click "Connect Wallet" in the navigation bar and select your Sui wallet.

### 2. Upload Dataset

1. Navigate to Upload page
2. Drag & drop your dataset file (max 10 GB)
3. Click "Start Upload Process"
4. Wait for Walrus storage confirmation
5. AI will automatically analyze JSON datasets

### 3. Mint NFT Certificate

1. After upload and analysis complete
2. Enter a dataset title
3. Click "Generate NFT Certificate"
4. Approve transaction in wallet
5. View your NFT on Sui explorer

### 4. Browse Marketplace

- Filter by quality score, price, category
- Sort by relevance, quality, price, date
- Click dataset cards for details

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```bash
GROQ_API_KEY=your_groq_api_key_here
```

Get Groq API key from: https://console.groq.com

### Smart Contract

To deploy a new contract version:

```bash
cd contracts
sui client publish --gas-budget 100000000
```

Update `PACKAGE_ID` in `/lib/contract/nftService.ts`

## 🧪 Testing

```bash
# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add `GROQ_API_KEY` to Vercel environment variables.

## 📊 Features Roadmap

- [ ] Real-time dataset marketplace with purchases
- [ ] Dataset preview/sampling
- [ ] User profiles and reputation
- [ ] Advanced search and recommendations
- [ ] Dataset versioning
- [ ] Collaborative filtering
- [ ] API access tokens

## 🐛 Known Issues

- Mock data used for marketplace (real data integration pending)
- String parameters limited in smart contract (SDK v1.38.0 fixes this)
- SuiNS name resolution not yet implemented

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🔗 Links

- **Sui Network**: https://sui.io
- **Walrus Storage**: https://walrus.site
- **Groq AI**: https://groq.com
- **Sui Explorer**: https://suiscan.xyz/testnet

## 💬 Support

For issues or questions:

- Open a GitHub issue
- Check Sui Discord: https://discord.gg/sui
- Walrus documentation: https://docs.walrus.site

---

**Built with ❤️ using Sui, Walrus, and Groq AI**

## Features

- Dataset upload with Walrus decentralized storage
- AI quality analysis using Groq
- NFT certificate minting on Sui blockchain
- Marketplace for dataset trading
- Bounty system for data collection

## Tech Stack

- Next.js 15 + TypeScript
- Sui blockchain (Move smart contracts)
- Walrus storage
- Groq AI (llama-3.3-70b-versatile)

## Setup

```bash
npm install
npm run dev
```

Create `.env.local`:

```
GROQ_API_KEY=your_key_here
NEXT_PUBLIC_SUI_NETWORK=devnet
```

## Smart Contract

**Package ID**: `0xb3e4accc5e4642f064a21efe496dc920b0dda33b86b4d252679ec5383e19bd00`  
**Network**: Sui Devnet
