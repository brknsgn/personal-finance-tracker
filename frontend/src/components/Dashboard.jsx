import { useState, useEffect } from 'react';
// 1. Import required tools from Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';

// 2. Register the tools so Chart.js knows how to draw them
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all data when the dashboard loads
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('http://localhost:3000/transactions');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setTransactions(data.data || data);
      } catch (error) {
        console.error("Dashboard data error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  if (isLoading) return <div>Loading Dashboard...</div>;

  // DATA CALCULATION LOGIC (Client-side Aggregation)

  
  let totalIncome = 0;
  let totalExpense = 0;
  
  // We will store category totals for the Pie Chart (Expenses only)
  const categoryTotals = {};
  
  // We will store monthly totals for the Line Chart
  const monthlyIncome = {};
  const monthlyExpense = {};

  transactions.forEach((t) => {
    const amount = Number(t.amount);
    
    // Get a short month name (e.g., 'Jan', 'Feb', 'Jul')
    const dateObj = new Date(t.date || t.createdAt);
    const month = dateObj.toLocaleString('en-US', { month: 'short' });

    if (t.type === 'income') {
      totalIncome += amount;
      // Add to monthly income tracker
      monthlyIncome[month] = (monthlyIncome[month] || 0) + amount;
    } else {
      totalExpense += amount;
      
      // Add to category expense tracker (for Pie Chart)
      const cat = t.category || 'other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + amount;
      
      // Add to monthly expense tracker (for Line Chart)
      monthlyExpense[month] = (monthlyExpense[month] || 0) + amount;
    }
  });

  const balance = totalIncome - totalExpense;


  // CHART CONFIGURATIONS
  

  // PIE CHART DATA: Expense Distribution
  const pieData = {
    labels: Object.keys(categoryTotals), // e.g., ['food', 'rent', 'entertainment']
    datasets: [
      {
        data: Object.values(categoryTotals), // e.g., [500, 1500, 200]
        backgroundColor: [
          '#FF6384', // Red
          '#36A2EB', // Blue
          '#FFCE56', // Yellow
          '#4BC0C0', // Teal
          '#9966FF', // Purple
        ],
        hoverOffset: 4
      },
    ],
  };

  // LINE CHART DATA: Monthly Trend
  // We extract all unique months that exist in our data to use as the X-axis labels
  const allMonths = [...new Set([...Object.keys(monthlyIncome), ...Object.keys(monthlyExpense)])];
  
  const lineData = {
    labels: allMonths,
    datasets: [
      {
        label: 'Income',
        data: allMonths.map(m => monthlyIncome[m] || 0),
        borderColor: 'green',
        backgroundColor: 'rgba(0, 128, 0, 0.5)',
        tension: 0.3 // Makes the line slightly curved
      },
      {
        label: 'Expense',
        data: allMonths.map(m => monthlyExpense[m] || 0),
        borderColor: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
        tension: 0.3
      }
    ]
  };

 
  // UI RENDERING
  
  return (
    <div style={{ marginBottom: '30px' }}>
      
      {/* 1. BALANCE CARDS */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ flex: 1, padding: '20px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
          <h4>Total Income</h4>
          <h2 style={{ color: 'green', margin: 0 }}>+₺{totalIncome}</h2>
        </div>
        
        <div style={{ flex: 1, padding: '20px', backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
          <h4>Total Expense</h4>
          <h2 style={{ color: 'red', margin: 0 }}>-₺{totalExpense}</h2>
        </div>
        
        <div style={{ flex: 1, padding: '20px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
          <h4>Current Balance</h4>
          <h2 style={{ color: balance >= 0 ? 'black' : 'red', margin: 0 }}>₺{balance}</h2>
        </div>
      </div>

      {/* 2. CHARTS SECTION */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        
        {/* PIE CHART CONTAINER */}
        <div style={{ flex: 1, minWidth: '300px', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
          <h4 style={{ textAlign: 'center' }}>Expense Distribution (Category)</h4>
          <div style={{ height: '250px', display: 'flex', justifyContent: 'center' }}>
            {Object.keys(categoryTotals).length > 0 ? (
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            ) : (
              <p style={{ marginTop: '100px', color: 'gray' }}>No expense data to show.</p>
            )}
          </div>
        </div>

        {/* LINE CHART CONTAINER */}
        <div style={{ flex: 2, minWidth: '400px', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
          <h4 style={{ textAlign: 'center' }}>Monthly Income & Expense Trend</h4>
          <div style={{ height: '250px' }}>
            {allMonths.length > 0 ? (
              <Line data={lineData} options={{ maintainAspectRatio: false }} />
            ) : (
              <p style={{ marginTop: '100px', color: 'gray', textAlign: 'center' }}>No trend data to show.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}