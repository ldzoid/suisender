# 🚀 Sui Multisender

<div align="center">

**Send SUI and custom tokens to multiple recipients in a single transaction**

[Live Demo](https://suisender.com) · [Report Bug](https://github.com/ldzoid/suisender/issues)

![Sui](https://img.shields.io/badge/Sui-Blockchain-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![License](https://img.shields.io/badge/license-MIT-green)

</div>

## ✨ Features

- ⚡ **Batch send** to hundreds of addresses in one transaction
- 💰 **Zero fees** - you only pay network gas
- 💎 Support for **SUI and custom tokens**
- 📊 **CSV upload** for bulk recipient lists
- 🔍 **Balance validation** before sending
- 🔐 **Non-custodial** - connect any Sui wallet

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/ldzoid/suisender.git
cd suisender
npm install

# Configure network (optional)
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📖 Usage

1. **Connect** your Sui wallet
2. **Select** SUI or custom token
3. **Add recipients** (one per line):
   ```
   0x1234...5678, 10
   0xabcd...efgh, 25.5
   ```
   Supports: `address,amount` • `address amount` • `address = amount`
4. **Review** and send transaction

## 🛠️ Tech Stack

- [Next.js 16](https://nextjs.org/) + [React 19](https://react.dev/)
- [@mysten/dapp-kit](https://sdk.mystenlabs.com/dapp-kit) - Sui wallet integration
- [@mysten/sui](https://www.npmjs.com/package/@mysten/sui) - Sui SDK
- [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Contributing

Contributions welcome! Fork the repo and submit a PR.

```bash
git checkout -b feature/YourFeature
git commit -m 'Add YourFeature'
git push origin feature/YourFeature
```

## 📝 License

MIT License - see [LICENSE](LICENSE)

---

<div align="center">
Made with ❤️ for the Sui community
</div>
