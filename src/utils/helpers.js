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
  return dateStr.substring(0, 7); 
}

export function getCategoryColor(category) {
  const colors = {
    'Food & Dining': '#ff5500', 
    Shopping: '#8c1eff',        
    Transportation: '#00e5ff',  
    Entertainment: '#ff00e6',   
    Healthcare: '#00ff88',      
    Utilities: '#0055ff',       
    Rent: '#ff2a5f',            
    Education: '#00ffcc',       
    Travel: '#ffaa00',          
    Subscriptions: '#5500ff',   
    Salary: '#00ff88',          
    Freelance: '#00e5ff',       
    Investments: '#ffaa00',     
    Refund: '#a39eb5',          
    'Festival Bonus': '#ff00e6',
    Gift: '#ff2a5f',            
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
