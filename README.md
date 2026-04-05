<div align="center">
  <br />
  <img src="./public/logo.svg" alt="FinDash Logo" width="80" />
  <h1>💸 FinDash</h1>
  <p><strong>A Modern, Responsive, & Interactive Personal Finance Dashboard</strong></p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#project-structure">Project Structure</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/License-MIT-4CAF50?style=for-the-badge" alt="License" />
  </p>
</div>

---

## ✨ Overview

FinDash is a premium, beautifully crafted analytics dashboard built to manage and visualize personal financial activity. 
Freshly redesigned from the ground up, it features a striking **Cyberpunk Neon aesthetic**, **bottom navigation for mobile users**, **staggered micro-animations**, **ambient floating glow pulses**, and a **customizable light & dark mode**.

No component libraries. Just pure, clean React and meticulously crafted vanilla CSS.

---

## 🚀 Key Features

### 📊 Comprehensive Dashboard
* **Dynamic Summary Cards** – Total Balance, Income, Expenses, and Transaction Count neatly summarized.
* **Interactive Charts** – Area charts tracking monthly income vs. expenses, and donut charts breaking down category spending using Recharts.
* **Smart Insights** – Understand your peak spending days, savings rates, and month-over-month growth analytics instantly.

### 💰 Complete Transaction Management
* **Full CRUD Operations** – Add, edit, or delete personal transactions seamlessly.
* **Advanced Filtering** – Search text, filter by transaction type, select specific categories, or pick custom date ranges.
* **One-Click Export** – Export your perfectly filtered data instantly to **CSV** or **JSON**.

### 📱 Responsive & Modern Architecture
* **True Dynamic Sidebar** – The desktop sidebar features a fully interactive collapse mechanism, smoothly animating from full labels down to quick-icons (260px -> 84px) while perfectly redistributing the main dashboard layout space.
* **Mobile-First Experience** – The desktop sidebar intelligently hides and transitions into a native app-style bottom navigation bar on mobile devices.
* **Fluid UI & Ambient Animations** – Every component boasts buttery-smooth interactions, staggered list entries, and a continuous 5-second asynchronous ambient "glow breathing target" animation sequence on cards.
* **Neon Light/Dark Theme Support** – Beautiful, contrast-adjusted Cyberpunk palettes using electric pinks, cyans, and magentas for both day and night viewing, saved securely to local storage.

---

## 💻 Tech Stack

| Layer | Tools Used |
| :--- | :--- |
| **Framework** | React v19 |
| **Build Tool** | Vite v8 |
| **Styling** | Vanilla CSS *(Custom System & Variables)* |
| **Icons** | Lucide React |
| **Data Viz** | Recharts |
| **State** | React Context API + `useReducer` |
| **Storage** | Browser `localStorage` |

---

## 🛠️ Getting Started

### Prerequisites
Make sure you have Node.js version 18+ installed on your machine.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Finance-Dashboard.git
   cd Finance-Dashboard
   ```

2. **Install all dependencies**
   ```bash
   npm install
   ```

3. **Spin up the visual development server**
   ```bash
   npm run dev
   ```
   > The application will automatically be available at `http://localhost:5173/`. 

### 🌐 Live Deployment
This project is fully configured to host on **GitHub Pages**. 
To securely compile and push a live deployment online, simply run:

```bash
npm run deploy
```
> The dashboard will instantly be optimized, bundled with Vite Rolldown, and hosted securely via GitHub Pages without any extra setup required!

---

## 📁 Project Structure

```text
src/
├── components/
│   ├── Charts.jsx              # Chart visualizations 
│   ├── RecentTransactions.jsx  # Compact list view
│   ├── Sidebar.jsx             # Hybrid Nav (Sidebar & Bottom Bar)
│   ├── SummaryCards.jsx        # Stat summaries
│   └── TransactionModal.jsx    # Pop-up controller
├── context/
│   └── AppContext.jsx          # Brain of the app (Reducer + Persist)
├── data/
│   └── transactions.js         # Intelligent data mocking generator
├── pages/
│   ├── DashboardPage.jsx       # Landing overview 
│   ├── TransactionsPage.jsx    # Filtering logic & table view
│   └── InsightsPage.jsx        # Analytics crunching
├── utils/
│   └── helpers.js              # Business logic & transformers
├── App.jsx                     # Layout shell
├── main.jsx                    # Core DOM entry
└── index.css                   # The robust design system
```

---

<div align="center">
  <p>Crafted explicitly for premium financial insight generation.</p>
</div>
