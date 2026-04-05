// Mock transaction data — India-specific
const categories = {
  expense: [
    'Food & Dining',
    'Shopping',
    'Transportation',
    'Entertainment',
    'Healthcare',
    'Utilities',
    'Rent',
    'Education',
    'Travel',
    'Subscriptions',
  ],
  income: ['Salary', 'Freelance', 'Investments', 'Refund', 'Festival Bonus'],
};

const descriptions = {
  'Food & Dining': [
    'Swiggy Order',
    'Zomato Delivery',
    'Chai & Snacks',
    'DMart Groceries',
    'BigBasket Order',
    'Domino\'s Pizza',
    'McDonald\'s',
    'Haldiram\'s',
    'Cafe Coffee Day',
    'Restaurant Dinner',
    'Blinkit Order',
    'Saravana Bhavan',
  ],
  Shopping: [
    'Flipkart Purchase',
    'Amazon India',
    'Myntra Clothing',
    'Ajio Order',
    'Nykaa Beauty',
    'Reliance Digital',
    'Croma Electronics',
    'Meesho Order',
    'Lifestyle Clothing',
    'Tanishq Jewellery',
  ],
  Transportation: [
    'Ola Cab Ride',
    'Uber Ride',
    'Petrol Fill-up',
    'Metro Card Recharge',
    'Rapido Bike Ride',
    'Auto Rickshaw',
    'IRCTC Train Ticket',
    'BMTC Bus Pass',
    'Parking Charges',
  ],
  Entertainment: [
    'Netflix Subscription',
    'Amazon Prime',
    'Hotstar Subscription',
    'Jio Cinema',
    'Movie Tickets – BookMyShow',
    'Sony LIV',
    'Lenskart Purchase',
    'Gaming Recharge',
  ],
  Healthcare: [
    'PharmEasy Order',
    'Apollo Pharmacy',
    'Doctor Consultation',
    '1mg Purchase',
    'Cult.fit Membership',
    'Dental Checkup',
    'Eye Checkup',
    'Practo Appointment',
  ],
  Utilities: [
    'BESCOM Electricity Bill',
    'BWSSB Water Bill',
    'Airtel Broadband',
    'Jio Recharge',
    'BSES Electricity Bill',
    'Vi Recharge',
    'MSEB Bill',
    'LPG Cylinder Booking',
  ],
  Rent: [
    'Monthly House Rent',
    'PG/Hostel Rent',
    'Society Maintenance',
  ],
  Education: [
    'Udemy Course',
    'Coursera Subscription',
    'BYJU\'S Subscription',
    'Unacademy Plan',
    'NPTEL Certificate',
    'Internshala Course',
    'Book Purchase – Amazon',
  ],
  Travel: [
    'IndiGo Flight Ticket',
    'Air India Flight',
    'IRCTC Tatkal Booking',
    'OYO Hotel Stay',
    'MakeMyTrip Booking',
    'Goibibo Hotel',
    'Redbus Ticket',
    'Cleartrip Booking',
  ],
  Subscriptions: [
    'Adobe Creative Cloud',
    'Microsoft 365',
    'Google One Storage',
    'YouTube Premium',
    'Notion Pro',
    'Canva Pro',
  ],
  Salary: [
    'Monthly Salary',
    'Performance Bonus',
    'Variable Pay',
    'Increment Payment',
  ],
  Freelance: [
    'Web Development Project',
    'UI/UX Design Contract',
    'Upwork Payment',
    'Fiverr Earnings',
    'Content Writing',
    'Consulting Fee',
  ],
  Investments: [
    'Zerodha Dividend',
    'Mutual Fund Return',
    'FD Interest',
    'PPF Interest',
    'Gold Bond Return',
    'NPS Return',
    'Groww Returns',
  ],
  Refund: [
    'Flipkart Refund',
    'Amazon Refund',
    'IRCTC Cancellation Refund',
    'Swiggy Refund',
    'Insurance Refund',
  ],
  'Festival Bonus': [
    'Diwali Bonus',
    'Holi Gift',
    'Eid Gift',
    'Pongal Bonus',
    'Navratri Gift',
  ],
};

function randomBetween(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateId() {
  return 'txn_' + Math.random().toString(36).substr(2, 9);
}

export function generateTransactions(count = 150) {
  const transactions = [];
  const startDate = new Date(2025, 6, 1); // July 2025
  const endDate = new Date(2026, 3, 1);   // April 2026

  for (let i = 0; i < count; i++) {
    const type = Math.random() > 0.35 ? 'expense' : 'income';
    const category = pickRandom(categories[type]);
    const description = pickRandom(descriptions[category]);
    const date = randomDate(startDate, endDate);

    let amount;
    if (type === 'income') {
      if (category === 'Salary') {
        amount = randomBetween(45000, 120000);    // ₹45k–₹1.2L/month
      } else if (category === 'Freelance') {
        amount = randomBetween(8000, 80000);       // ₹8k–₹80k
      } else if (category === 'Investments') {
        amount = randomBetween(500, 25000);        // ₹500–₹25k
      } else if (category === 'Festival Bonus') {
        amount = randomBetween(2000, 20000);       // ₹2k–₹20k
      } else {
        amount = randomBetween(200, 5000);         // Refunds
      }
    } else {
      if (category === 'Rent') {
        amount = randomBetween(8000, 35000);       // ₹8k–₹35k
      } else if (category === 'Travel') {
        amount = randomBetween(2000, 25000);       // ₹2k–₹25k
      } else if (category === 'Food & Dining') {
        amount = randomBetween(80, 1500);          // ₹80–₹1500
      } else if (category === 'Shopping') {
        amount = randomBetween(300, 12000);        // ₹300–₹12k
      } else if (category === 'Utilities') {
        amount = randomBetween(200, 3000);         // ₹200–₹3k
      } else if (category === 'Healthcare') {
        amount = randomBetween(200, 5000);         // ₹200–₹5k
      } else if (category === 'Education') {
        amount = randomBetween(500, 8000);         // ₹500–₹8k
      } else if (category === 'Subscriptions') {
        amount = randomBetween(99, 2000);          // ₹99–₹2k
      } else if (category === 'Transportation') {
        amount = randomBetween(50, 2000);          // ₹50–₹2k
      } else {
        amount = randomBetween(100, 3000);
      }
    }

    transactions.push({
      id: generateId(),
      date: date.toISOString().split('T')[0],
      description,
      category,
      type,
      amount,
    });
  }

  // Sort by date descending
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  return transactions;
}

// Pre-generated consistent data for the app (seeded once)
let cachedTransactions = null;

export function getTransactions() {
  if (!cachedTransactions) {
    cachedTransactions = generateTransactions(150);
  }
  return cachedTransactions;
}

export function resetTransactions() {
  cachedTransactions = null;
}

export { categories };
