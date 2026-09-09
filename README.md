# Solana Elite Terminal — v1.0.0

> Enterprise Solana Leverage & Pump.fun Sniper Terminal  
> Windows 11 (Electron/Tauri) · Cloud Web (Next.js) · Mobile PWA

---

## Architecture

```
solana-terminal/
├── frontend/        # Next.js 14 + TailwindCSS (glassmorphism UI)
├── backend/         # NestJS + Fastify API
├── workers/         # BullMQ strategy agents (TypeScript)
├── programs/        # Anchor on-chain programs (Rust)
│   ├── smart-wallet/
│   └── flashloan/
└── packages/
    └── sdk/         # TypeScript SDK (shared types + API client)
```

---

## Quick Start

### Prerequisites
- Node.js ≥ 20
- Rust + Anchor CLI (`cargo install --git https://github.com/coral-xyz/anchor avm`)
- Solana CLI ≥ 1.18

### 1. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev          # http://localhost:3000
```

### 2. Backend (NestJS)

```bash
cd backend
npm install
cp .env.example .env  # fill in JWT_SECRET, DATABASE_URL, REDIS_URL
npm run start:dev     # http://localhost:4000
```

### 3. Workers / Agents

```bash
cd workers
npm install
npm run start
```

### 4. On-chain Programs (devnet)

```bash
anchor build
anchor deploy --provider.cluster devnet
```

---

## Core Modules

| Module | Description |
|---|---|
| **Leverage Engine** | Up to 250x perps via Drift / Jupiter Perps |
| **Swap Aggregator** | Best-route discovery via Jupiter, Raydium, Orca |
| **Pump.fun Sniper** | Auto-snipe new launches with 0–100 risk scoring |
| **Smart Wallet** | Anchor-based on-chain wallet orchestration |
| **Flashloan** | Atomic borrow → swap → repay orchestration |
| **Agents** | Scalper 250x, Funding Harvest, Whale Shadow, Arb Route |

---

## Access Tiers

| Tier | Leverage | Sniper | Advanced Agents |
|---|---|---|---|
| Free | — | Basic | — |
| Pro | Up to 50x | Limited | — |
| Elite | Up to 250x | Full | ✅ |

---

## Environment Variables

```dotenv
# backend/.env
JWT_SECRET=change-me-in-production
DATABASE_URL=******localhost:5432/terminal
REDIS_URL=redis://localhost:6379
FRONTEND_URL=http://localhost:3000
```

---

## License

MIT
