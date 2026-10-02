# Sahayak (सहायक)
> **"Your Inventory Assistant, Just a Message Away."**  
> *"Speak. Send. Sahayak Handles the Rest."*

Sahayak is a hackathon-ready, full-stack AI-powered inventory assistant created specifically for local neighborhood kirana stores and small retailers. Instead of forcing shopkeepers to learn complex Point-of-Sale (POS) software or record in manual paper notebooks (khaata), Sahayak lets store owners simply send natural-language text or voice messages in **Hindi, Marathi, Hinglish, or English**.

---

## 🚀 Live Demo Flow in 60–90 Seconds (For Judges & Evaluators)

1. **3D Futuristic Intro (`/`)**:
   - Experience the 3D interactive inventory crate spatial scene with green/cyan rim lighting, floating parcel physics, and cursor parallax.
   - Click **LET'S GO**.
2. **Main Landing Page (`/home`)**:
   - Scroll through the SaaS presentation, traditional vs Sahayak comparison, 4-step workflow, and test the **Interactive Assistant Simulator** right on the page.
   - Click **Login** or **Get Started**.
3. **Instant 1-Click Judge Login (`/login`)**:
   - Click **"Instant Demo Login as Ramesh (Kirana Store)"**.
4. **Dashboard (`/dashboard`)**:
   - Greeted by *Good morning, Ramesh* and real-time statistics: Total Products (8), Stock Added Today (+46), Stock Sold Today (-31), and Low Stock (3).
   - In the **"Tell Sahayak what happened..."** assistant bar, click the mic or type:
     ```text
     "Aaj 20 Maggi aayi aur 5 Pepsi bikli"
     ```
   - Sahayak parses 2 structured updates with 96%+ confidence:
     - **Maggi 2-Minute Noodles**: +20 units (Stock In)
     - **Pepsi 500ml Bottle**: -5 units (Stock Out)
   - Click **[Confirm & Update Inventory]**.
   - Watch the celebratory confirmation, real-time inventory increment/decrement, and new transaction logs in the audit trail.
   - Click **[Undo]** to test reversing the transaction with full audit trail!
   - View the **Predicted Sales Trend** card computing Ordinary Least Squares (OLS) linear regression on the rolling 7-day sales data with tomorrow's predicted sales volume and stock replenishment recommendations.
   - Navigate to **Low Stock Alerts** to see Maggi & Tata Salt safety buffer warnings with 1-click **[Restock +10]** replenishment.
   - Go to **Inventory** or **Transactions** and click **[Download CSV]** to export Excel-compatible offline manual ledger sheets complete with UTF-8 BOM encoding for Hindi and Marathi characters.

---

## 🎯 The Problem

13+ million neighborhood kirana and retail shops in India still rely on paper notebooks, memory, or informal WhatsApp notes:
- **Time wasted:** 10–12 hours spent weekly manually tallying stock.
- **Stock-outs:** Popular goods run out without advance notice, leading to lost customer revenue.
- **Complex POS:** Supermarket software has 100+ nested menus and requires expensive hardware and barcode readers that local storekeepers avoid.

## 💡 The Solution

**WhatsApp-Style Natural Language Inventory**:
Shopkeepers speak or text exactly how they speak to their suppliers and helpers:
- *"Aaj 20 Maggi aayi"* ➔ **+20 Maggi (Stock In)**
- *"5 Pepsi bottles sold"* ➔ **-5 Pepsi (Stock Out)**
- *"10 Parle-G add karo"* ➔ **+10 Parle-G (Stock In)**
- *"20 Maggi आली आणि 5 Pepsi विकल्या"* ➔ **+20 Maggi In, -5 Pepsi Out (Marathi)**

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide React
- **3D Spatial Graphics**: Three.js WebGL spatial scene with studio lighting, floating parcels, particle fog, and mouse damping
- **NLP Engine**: Modular multilingual rule-based parser with number word mapping, Devanagari digit recognition, verb intent classifier, and catalog fuzzy similarity matcher
- **Voice Recognition**: Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) supporting `hi-IN`, `mr-IN`, and `en-IN` with visual audio waveforms
- **Database & Auth**:
  - Client-side persistent data engine with localStorage/IndexedDB
  - Pluggable Firebase Firestore / Supabase schema (see `schema.sql`)
  - Row Level Security (RLS) policies protecting tenant isolation
- **Export & Backup**: One-click JSON database backup for store records

---

## 🗄️ Database Tables & Schema

See [`schema.sql`](./schema.sql) for the complete SQL schema and Row Level Security definitions:
- `profiles`: user ID, full name, shop name, phone, language preference
- `products`: ID, user ID, name, category, SKU, quantity, minimum stock, unit, cost, selling price
- `inventory_transactions`: ID, product ID, type (`stock_in`, `stock_out`, `adjustment`, `undo`), previous quantity, new quantity, raw source message
- `messages`: raw input, parsed intents, confidence score, status
- `alerts`: low stock warnings, out-of-stock notices, read/unread states

---

## 📦 Local Development

1. Clone repository & install dependencies:
   ```bash
   npm install
   ```
2. Start development server on port 3000:
   ```bash
   npm run dev
   ```
3. Open browser at `http://localhost:3000` (or `http://localhost:3000/#/dashboard`).

---

## 🌟 Key Differentiators

- **Zero-Friction Kirana Focus**: No barcodes, no SKU typing, no complex POS menus.
- **Ambiguity & Duplicate Protection**: Flags ambiguous entries and duplicate messages submitted within 60 seconds.
- **Audit & 1-Click Undo**: Every AI action is transparently logged and reversible.
- **Native Multilingual**: Speaks Hindi, Hinglish, Marathi, and Indian English natively.
