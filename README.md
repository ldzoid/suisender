# 🚀 Sui Multisender

<div align="center">

![Sui Multisender](https://img.shields.io/badge/Sui-Blockchain-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![License](https://img.shields.io/badge/license-MIT-green)

**Send SUI and custom tokens to multiple recipients in a single transaction**

[Live Demo](https://suisender.com) · [Report Bug](https://github.com/ldzoid/suisender/issues) · [Request Feature](https://github.com/ldzoid/suisender/issues)

</div>

---

## ✨ Features

- **⚡ Lightning Fast** - Batch send to hundreds of addresses in one transaction
- **💰 100% Free** - Zero fees, zero commissions - you only pay network gas
- **🎯 Smart Validation** - Real-time address and amount validation
- **💎 Native SUI & Custom Tokens** - Support for any SPL token on Sui
- **🔍 Balance Checking** - Automatic balance verification before sending
- **📊 CSV Upload** - Import recipient lists from CSV files
- **🎨 Modern UI** - Clean, intuitive interface with Sui native design
- **🔐 Secure** - Non-custodial, connect with any Sui wallet
- **📱 Responsive** - Works seamlessly on desktop and mobile

## 🎯 Use Cases

- **Airdrops** - Distribute tokens to community members
- **Payroll** - Pay team members or contributors in crypto
- **Rewards** - Send rewards to multiple users at once
- **Refunds** - Process bulk refunds efficiently
- **Gaming** - Distribute in-game tokens or rewards

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Sui wallet (Sui Wallet, Suiet, etc.)

### Installation

```bash
# Clone the repository
git clone https://github.com/ldzoid/suisender.git
cd suisender

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Network: mainnet or testnet
NEXT_PUBLIC_NETWORK=mainnet
```

## 📖 How to Use

### 1. Connect Your Wallet
Click "Connect Wallet" and select your preferred Sui wallet.

### 2. Choose Token Type
- Select **SUI** for native SUI transfers
- Select **TOKEN** to send custom tokens from your wallet

### 3. Add Recipients
Enter recipients in the textarea, one per line:

```
0x1234...5678, 10
0xabcd...efgh, 25.5
```

**Supported formats:**
- `address,amount`
- `address amount`
- `address = amount`

Or upload a CSV file with addresses and amounts.

### 4. Review & Send
- Review total amount and recipient count
- Check your balance
- Confirm gas estimation
- Click "Send Transaction" and approve in your wallet

## 🏗️ Built With

- **[Next.js 16](https://nextjs.org/)** - React framework
- **[React 19](https://react.dev/)** - UI library
- **[@mysten/dapp-kit](https://sdk.mystenlabs.com/dapp-kit)** - Sui wallet integration
- **[@mysten/sui](https://www.npmjs.com/package/@mysten/sui)** - Sui blockchain SDK
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications
- **[Lucide React](https://lucide.dev/)** - Icons

## 🛠️ Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 📁 Project Structure

```
suisender/
├── app/                    # Next.js app directory
│   ├── components/        # React components
│   ├── providers/         # Context providers
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Shared components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── MultisendForm.tsx
├── lib/                   # Utility functions
│   ├── constants.ts       # App constants
│   ├── networks.ts        # Network configuration
│   └── transactions.ts    # Transaction logic
└── public/                # Static assets
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Sui Foundation](https://sui.io/) for the amazing blockchain
- [Mysten Labs](https://mystenlabs.com/) for the development tools
- The Sui community for inspiration and support

## 📞 Contact

- **Website**: [suisender.com](https://suisender.com)
- **GitHub**: [@ldzoid](https://github.com/ldzoid)
- **Issues**: [GitHub Issues](https://github.com/ldzoid/suisender/issues)

## ⭐ Star History

If you find this project useful, please consider giving it a star! ⭐

---

<div align="center">
Made with ❤️ for the Sui community
</div>
