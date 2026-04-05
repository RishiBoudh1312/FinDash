import SummaryCards from '../components/SummaryCards';
import { BalanceTrendChart, SpendingBreakdownChart } from '../components/Charts';
import RecentTransactions from '../components/RecentTransactions';

export default function DashboardPage() {
  return (
    <div className="page-wrapper">
      <div className="page-header animate-fade-in">
        <h1>Dashboard</h1>
        <p>Welcome back! Here is your financial overview.</p>
      </div>

      <SummaryCards />

      <div className="charts-grid stagger">
        <div style={{ animationDelay: '200ms' }} className="animate-slide-up">
          <BalanceTrendChart />
        </div>
        <div style={{ animationDelay: '300ms' }} className="animate-slide-up">
          <SpendingBreakdownChart />
        </div>
      </div>

      <div style={{ animationDelay: '400ms' }} className="animate-slide-up">
        <RecentTransactions />
      </div>
    </div>
  );
}
