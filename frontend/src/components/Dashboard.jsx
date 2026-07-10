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
  // State for the global summary statistics
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0, categoryExpenses: [] });
  
  // State for the paginated transaction list
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const limit = 10;

  // Fetch summary data once when the component mounts
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch('http://localhost:3000/transactions/summary');
        const result = await response.json();
        
        if (result.success) {
          setSummary(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch summary:", error);
      }
    };

    fetchSummary();
  }, []);

  // Fetch paginated transactions whenever the currentPage changes
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/transactions?page=${currentPage}&limit=${limit}`);
        const result = await response.json();
        
        if (result.success) {
          setTransactions(result.data);
          setCurrentPage(result.pagination.page);
          setTotalPages(result.pagination.totalPages);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [currentPage]);

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

const handleDownloadCSV = async () => {
    try {
      // 1. Call our new backend endpoint.
      const response = await fetch('http://localhost:3000/export/csv');
      if (!response.ok) throw new Error('Download failed from server.');

      // 2. Convert the response into a Blob (Binary Large Object - essentially a file in memory).
      const blob = await response.blob();
      
      // 3. Create a temporary, hidden URL that points to this file in the browser's memory.
      const url = window.URL.createObjectURL(blob);
      
      // 4. Create an invisible HTML 'a' (anchor/link) element.
      const link = document.createElement('a');
      link.href = url;
      // Set the filename that the user will see when saving.
      link.setAttribute('download', 'transactions.csv'); 
      
      // 5. Attach it to the page, click it programmatically to start download, and remove it immediately.
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Failed to download CSV.');
    }
  };
  
  // Define budget limits (Ideally, this should be fetched from the Backend).
  const budgetLimits = {
    food: 4000,
    rent: 20000,
    entertainment: 5000,
    other: 5000
  };

  // Assuming 'categoryTotals' is the object you created in the previous step (e.g., { food: 2500, rent: 8000 })
  // We filter to find ONLY the categories where spent amount is strictly greater than the limit.
  const overBudgetCategories = Object.keys(categoryTotals).filter(cat => {
    const spent = categoryTotals[cat];
    const limit = budgetLimits[cat];
    return limit && spent > limit;
  });

  // UI RENDERING
  
 return (
    <div className="mb-8">
      
      {/* EXPORT BUTTON */}
      <div className="flex justify-end mb-4">
        <button 
          onClick={handleDownloadCSV} 
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded cursor-pointer transition-colors"
        >
          📥 Export to CSV
        </button>
      </div>

      {/* BUDGET WARNING ALERT */}
      {overBudgetCategories.length > 0 && (
        <div className="p-4 bg-rose-100 text-rose-700 border border-rose-300 rounded-lg mb-5">
          <strong>⚠️ Budget Alert:</strong> You have exceeded your monthly limit for: 
          
          {overBudgetCategories.map(cat => (
            <span key={cat} className="ml-2 capitalize font-bold">
              {cat} (Limit: ₺{budgetLimits[cat]}, Spent: ₺{categoryTotals[cat]})
            </span>
          ))}
        </div>
      )}

      {/* 1. BALANCE CARDS  */}
      <div className="flex flex-row gap-3 md:gap-5 mb-5 overflow-x-auto">
        
        <div className="flex-1 p-4 bg-green-50 border border-green-200 rounded-lg min-w-32.5">
          <h4 className="text-green-700 font-semibold mb-1 text-sm md:text-base">Total Income</h4>
          <h2 className="text-green-600 text-lg md:text-2xl font-bold m-0">+₺{totalIncome}</h2>
        </div>
        
        <div className="flex-1 p-4 bg-red-50 border border-red-200 rounded-lg min-w-32.5">
          <h4 className="text-red-700 font-semibold mb-1 text-sm md:text-base">Total Expense</h4>
          <h2 className="text-red-600 text-lg md:text-2xl font-bold m-0">-₺{totalExpense}</h2>
        </div>
        
        <div className="flex-1 p-4 bg-blue-50 border border-blue-200 rounded-lg min-w-32.5">
          <h4 className="text-blue-700 font-semibold mb-1 text-sm md:text-base">Current Balance</h4>
          <h2 className={`text-lg md:text-2xl font-bold m-0 ${balance >= 0 ? 'text-black' : 'text-red-600'}`}>
            ₺{balance}
          </h2>
        </div>
        
      </div>

      {/* 2. CHARTS SECTION  */}
      <div className="flex flex-col lg:flex-row gap-5">
        
        {/* PIE CHART CONTAINER */}
        <div className="flex-1 min-w-75 p-5 border border-gray-200 rounded-lg shadow-sm bg-white">
          <h4 className="text-center text-gray-700 font-semibold mb-4">Expense Distribution (Category)</h4>
          <div className="h-62.5 flex justify-center">
            {Object.keys(categoryTotals).length > 0 ? (
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            ) : (
              <p className="mt-24 text-gray-500">No expense data to show.</p>
            )}
          </div>
        </div>

        {/* LINE CHART CONTAINER */}
        <div className="flex-2 min-w-75 lg:min-w-100 p-5 border border-gray-200 rounded-lg shadow-sm bg-white">
          <h4 className="text-center text-gray-700 font-semibold mb-4">Monthly Income & Expense Trend</h4>
          <div className="h-62.5">
            {allMonths.length > 0 ? (
              <Line data={lineData} options={{ maintainAspectRatio: false }} />
            ) : (
              <p className="mt-24 text-gray-500 text-center">No trend data to show.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}