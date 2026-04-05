export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatMonth(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function getMonthKey(dateStr) {
  return dateStr.substring(0, 7); // YYYY-MM
}

export function getCategoryColor(category) {
  const colors = {
    'Food & Dining': '#ff5500', // Neon Orange
    Shopping: '#8c1eff',        // Electric Purple
    Transportation: '#00e5ff',  // Neon Cyan
    Entertainment: '#ff00e6',   // Neon Magenta
    Healthcare: '#00ff88',      // Neon Green
    Utilities: '#0055ff',       // Neon Blue
    Rent: '#ff2a5f',            // Neon Pink
    Education: '#00ffcc',       // Aquamarine
    Travel: '#ffaa00',          // Cyber Yellow
    Subscriptions: '#5500ff',   // Deep Indigo
    Salary: '#00ff88',          // Neon Green
    Freelance: '#00e5ff',       // Neon Cyan
    Investments: '#ffaa00',     // Cyber Yellow
    Refund: '#a39eb5',          // Muted Silver
    'Festival Bonus': '#ff00e6',// Neon Magenta
    Gift: '#ff2a5f',            // Neon Pink
  };
  return colors[category] || '#94a3b8';
}

export function exportToCSV(transactions) {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  const rows = transactions.map((t) => [
    t.date,
    `"${t.description}"`,
    t.category,
    t.type,
    t.amount,
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function exportToJSON(transactions) {
  const json = JSON.stringify(transactions, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `transactions_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}
