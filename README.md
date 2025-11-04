# ShiftPlay — Gamified Cross‑Chain Swaps (Powered by SideShift)

ShiftPlay turns crypto swapping into a game. Users connect a wallet, make swaps via the SideShift API, and earn XP, NFT rewards, streak bonuses, and climb a public leaderboard.

## What this app does

- Swap crypto across chains using the SideShift API (e.g., BTC → USDT, ETH → MATIC)
- Earn XP for completed swaps, with streak bonuses and level progression
- Unlock gamified rewards (NFT names/tiers, mystery boxes) on milestones
- See real‑time progress: swap quotes, order creation, status updates (via webhook)
- View a global leaderboard (by XP) and your swap history/rewards
- Share a referral link to earn bonus XP (productized in UI)
- Ask the in‑app AI assistant questions about swaps/rewards (optional, needs API key)

## Why SideShift?

- SideShift provides fast, no-signup cross‑chain swaps via a developer API
- We proxy requests server-side for security and to support webhooks
- This project’s swap logic is built entirely around SideShift’s Fixed Order flow

## Architecture

- Frontend (Vite + React + TypeScript + Tailwind)
  - Wallet connect, waterglass UI, Swap interface, Rewards panel, History, Leaderboard
  - AI Chat widget in navbar (calls backend `/api/ai/chat`)
  - Uses `VITE_API_BASE` to reach the backend API (dev defaults to `/api` via proxy)
- Backend (Node + Express + Mongoose)
  - Routes
    - `POST /api/users/connect` — create/get user by wallet address
    - `GET /api/users/:id/swaps` — recent swaps (accepts Mongo ObjectId or wallet address)
    - `GET /api/users/:id/rewards` — user rewards
    - `GET /api/users/leaderboard/top` — top by XP
    - `GET /api/sideshift/coins` — passthrough to SideShift
    - `POST /api/sideshift/quote` — create SideShift quote (depositCoin, settleCoin, depositAmount)
    - `POST /api/sideshift/order` — create Fixed Order (quoteId, settleAddress, affiliateId)
    - `GET /api/sideshift/order/:id` — fetch order status
    - `POST /api/sideshift/webhook` — SideShift webhook (updates swap + grants rewards)
    - `POST /api/rewards/:id/claim` — claim reward
    - `POST /api/ai/chat` — AI assistant (OpenAI or mock)
  - Data models (MongoDB)
    - `User` — walletAddress, username, xp, level, totals, streaks
    - `Swap` — pair, amounts, status, xpEarned, timestamps, SideShift order id
    - `Reward` — type (`nft`, `mystery_box`, `bonus_xp`), name, claimed
  - Reward logic (on webhook): XP, levels (with tier NFTs), streak bonuses, mystery boxes

## How the SideShift integration works

1) User selects coins and enters an amount on the frontend
2) Frontend asks backend for a quote: `POST /api/sideshift/quote`
3) Frontend creates a Fixed Order: `POST /api/sideshift/order` with `quoteId` and `settleAddress`
4) User pays to SideShift’s provided deposit address
5) SideShift settles and POSTs status to our webhook: `/api/sideshift/webhook`
6) Backend marks the swap completed, calculates XP, assigns rewards, updates leaderboard

Notes:
- Affiliate support: set `SIDESHIFT_AFFILIATE_ID` if you have one
- Webhook: You must configure your public API webhook URL in SideShift’s dashboard

## Local development

Requirements: Node 18+, npm, MongoDB (local Docker or Atlas)

- Start MongoDB (pick one)
  - Docker: `docker run --name shiftplay-mongo -p 27017:27017 -d mongo:6`
  - Atlas: create a cluster and get your connection string
- Backend API
  - `cd server`
  - `npm install`
  - Create `server/.env` with:
    - `PORT=4000`
    - `MONGO_URI=mongodb://localhost:27017/shiftplay` (or your Atlas URI)
    - `SIDESHIFT_API_URL=https://sideshift.ai/api/v2`
    - `SIDESHIFT_AFFILIATE_ID=` (optional)
    - `CLIENT_ORIGIN=http://localhost:5173`
    - `OPENAI_API_KEY=` (optional for AI chat)
  - `npm run dev`
- Frontend
  - In project root: `npm install`
  - `npm run dev`
  - Open `http://localhost:5173`

Dev proxy: Vite proxies `/api/*` to `http://localhost:4000` so you don’t need to hardcode URLs locally.

## Deploy: API on Render, Web on Vercel

- API (Render)
  - Use `server/` as root for the service (Node)
  - Build: `npm ci && npm run build`
  - Start: `node dist/index.js`
  - Environment vars:
    - `NODE_ENV=production`
    - `PORT=4000`
    - `MONGO_URI=YOUR_ATLAS_URI`
    - `SIDESHIFT_API_URL=https://sideshift.ai/api/v2`
    - `SIDESHIFT_AFFILIATE_ID=` (optional)
    - `CLIENT_ORIGIN=https://your-frontend-domain.vercel.app`
    - `OPENAI_API_KEY=` (optional)
  - After deploy, configure SideShift webhook URL to: `https://your-api.onrender.com/api/sideshift/webhook`

- Frontend (Vercel)
  - Add environment variable `VITE_API_BASE=https://your-api.onrender.com/api`
  - Deploy the repo; `vercel.json` is provided for Vite static build and SPA rewrites
  - After deploy, update the API’s `CLIENT_ORIGIN` env var to your Vercel domain

## Feature overview

- Waterglass modern UI with responsive layout
- Wallet connect (MetaMask or manual address entry)
- Swap interface with live quotes; Fixed Order creation via SideShift
- Rewards: XP, level NFTs, mystery boxes, 7‑day streak NFT
- Leaderboard by XP (top 10)
- Swap history and reward claiming
- Referral link sharing (copy to clipboard)
- AI Assistant (optional; mock without API key)

## Environment variables (summary)

- Frontend (Vercel)
  - `VITE_API_BASE` — your API base URL, e.g., `https://shiftplay-api.onrender.com/api`

- Backend (Render)
  - `PORT`, `MONGO_URI`, `SIDESHIFT_API_URL`, `SIDESHIFT_AFFILIATE_ID`, `CLIENT_ORIGIN`, `OPENAI_API_KEY`

## Security & production notes

- Always proxy SideShift requests through the backend; do not expose API keys client-side
- Use webhook signing/validation if available for your SideShift plan
- Lock CORS to your frontend origin (`CLIENT_ORIGIN`)
- Use HTTPS for both Vercel (default) and Render (default)

## Troubleshooting

- Coins not loading locally: ensure backend is running; the UI falls back to a static list
- ECONNREFUSED errors: start the backend on port 4000 or set `VITE_API_BASE` to your API URL
- Webhook rewards not appearing: make sure your webhook URL is public and configured in SideShift

---

This project is based on and powered by the SideShift API. All swap execution is handled by SideShift; ShiftPlay adds a gamified layer (XP, rewards, streaks, and leaderboard) plus a modern UX around the swap experience.

