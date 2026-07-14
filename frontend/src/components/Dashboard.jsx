import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import TransactionForm from './TransactionForm';
import {FaWallet,FaArrowUp,FaArrowDown} from "react-icons/fa";
import { FaChartPie, FaChartLine } from "react-icons/fa";
import CountUp from "react-countup";

// COMPONENT IMPORTS (Make sure your file paths are correct)
import TransactionTable from './TransactionTable'; 
import Filters from './Filters';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

export default function Dashboard() {
  // Global summary statistics (income, expense, balance)
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0, categoryExpenses: [] });
  
  // States for Table, Pagination, and Filters
  const [transactions, setTransactions] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDate, setFilterDate] = useState('');
   const handleDataChange = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  const limit = 10;

  // FETCH SUMMARY: Runs only once when the dashboard loads
const fetchSummary = async () => {
    try {
      const response = await fetch('https://personal-finance-tracker-avnm.onrender.com/transactions/summary');
      const result = await response.json();
      if (result.success) setSummary(result.data);
    } catch (error) { console.error("Failed to fetch summary:", error); }
  };

  
  useEffect(() => {
    fetchSummary();
  }, [refreshTrigger]);

  // FETCH TRANSACTIONS: Requests paginated and filtered data from the backend
const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const url = `https://personal-finance-tracker-avnm.onrender.com/transactions?page=${currentPage}&limit=${limit}&category=${filterCategory}&date=${filterDate}`;
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        setTransactions(result.data);
        setTotalPages(result.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory, filterDate]);

  
  useEffect(() => {
    fetchTransactions();
  }, [currentPage, filterCategory, filterDate, refreshTrigger]);

  // DELETE FUNCTION: Requires user confirmation before deleting a transaction
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this transaction?");
    if (!isConfirmed) return;
    
    try {
      const response = await fetch(`https://personal-finance-tracker-avnm.onrender.com/transactions/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchTransactions(); 
        fetchSummary(); 
      }
    } catch (err) { console.error('Delete error:', err); }
  };
  // EXPORT FUNCTION: Downloads transactions as a CSV file
  const handleDownloadCSV = async () => {
    try {
      const response = await fetch('https://personal-finance-tracker-avnm.onrender.com/export/csv');
      if (!response.ok) throw new Error('Download failed from server.');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions.csv'); 
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Failed to download CSV.');
    }
  };

  if (isLoading && transactions.length === 0) return <div>Loading Dashboard...</div>;

  // DATA CALCULATION LOGIC (For Charts & Balance Cards)
  const totalIncome = summary.income || 0;
  const totalExpense = summary.expense || 0;
  const balance = summary.balance || 0;

  // 2. PIE GRAPH 
  const categoryTotals = {};
  if (summary.categoryExpenses) {
    summary.categoryExpenses.forEach(cat => {
      categoryTotals[cat._id] = cat.totalSpent;
    });
  }

  // 3. LINEAR GRAPH: 
  const monthlyIncome = {};
  const monthlyExpense = {};

  transactions.forEach((t) => {
    const amount = Number(t.amount);
    const dateObj = new Date(t.date || t.createdAt);
    const month = dateObj.toLocaleString('en-US', { month: 'short' });

    if (t.type === 'income') {
      monthlyIncome[month] = (monthlyIncome[month] || 0) + amount;
    } else {
      monthlyExpense[month] = (monthlyExpense[month] || 0) + amount;
    }
  });

  // CHART CONFIGURATIONS
  const pieData = {
    labels: Object.keys(categoryTotals), 
    datasets: [{
        data: Object.values(categoryTotals),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverOffset: 4
    }],
  };

  const allMonths = [...new Set([...Object.keys(monthlyIncome), ...Object.keys(monthlyExpense)])];
  const lineData = {
    labels: allMonths,
    datasets: [
      { label: 'Income', data: allMonths.map(m => monthlyIncome[m] || 0), borderColor: 'green', backgroundColor: 'rgba(0, 128, 0, 0.5)', tension: 0.3 },
      { label: 'Expense', data: allMonths.map(m => monthlyExpense[m] || 0), borderColor: 'red', backgroundColor: 'rgba(255, 0, 0, 0.5)', tension: 0.3 }
    ]
  };
  
  // Budget Alert Logic
  const budgetLimits = { food: 4000, rent: 20000, entertainment: 5000, other: 5000 };
  const overBudgetCategories = Object.keys(categoryTotals).filter(cat => {
    const spent = categoryTotals[cat];
    const limit = budgetLimits[cat];
    return limit && spent > limit;
  });

 return (
    <div className="
    max-w-7xl
    mx-auto
    px-6
    py-8
    min-h-screen
    bg-linear-to-br
    from-slate-50
    to-gray-100
">
      
      {/* EXPORT BUTTON */}
      <div className="flex justify-end mb-8">
        <button onClick={handleDownloadCSV} className="px-5 py-3
    bg-emerald-500
    hover:bg-emerald-600
    text-white
    rounded-xl
    shadow-md
    hover:shadow-lg
    transition-all
">
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

      {/* BALANCE CARDS */}
      
      <div className="flex gap-4 mb-6 overflow-hidden">
        
       <div className="flex-1 p-6 bg-green-50 border border-green-200 rounded-2xl shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
        
          <h4 className="flex items-center gap-2 text-green-700 font-semibold mb-1 text-sm md:text-base">
    <FaArrowUp />
    Total Income
</h4>
          <h2 className="text-green-600 text-lg md:text-2xl font-bold m-0">+₺{totalIncome}</h2>
        </div>
       <div className="flex-1 p-6 bg-red-50 border border-red-200 rounded-2xl shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ">
          <h4 className="flex items-center gap-2 text-red-700 font-semibold mb-1 text-sm md:text-base"><FaArrowDown />Total Expense
          </h4>
          <h2 className="text-red-600 text-lg md:text-2xl font-bold m-0">-₺{totalExpense}</h2>
        </div>
        <div className="flex-1 p-6 bg-blue-50 border border-blue-200 rounded-2xl shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ">
         <h4 className="flex items-center gap-2 text-blue-700 font-semibold mb-1 text-sm md:text-base">
    <FaWallet />
    Current Balance
</h4>
          <h2 className={`text-lg md:text-2xl font-bold m-0 ${balance >= 0 ? 'text-black' : 'text-red-600'}`}>
            ₺{balance}
          </h2>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="flex flex-col lg:flex-row gap-5 mb-8">
        <div className="flex-1 min-w-75 p-8 border border-gray-200 rounded-2xl shadow-md bg-white">
          <h4 className="flex items-center justify-center gap-2 text-lg font-semibold mb-8">
    <FaChartPie />
    Expense Distribution
</h4>
          <div className="h-62.5 flex justify-center">
            {Object.keys(categoryTotals).length > 0 ? (
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            ) : (
              <p className="mt-24 text-gray-500">No expense data to show.</p>
            )}
          </div>
        </div>
        <div className="flex-2 min-w-75 lg:min-w-100 p-8 border border-gray-200 rounded-2xl shadow-md bg-white">
          <h4 className="flex items-center justify-center gap-2 text-lg font-semibold mb-8">
    <FaChartLine />
    Monthly Trend
</h4>
          <div className="h-62.5">
            {allMonths.length > 0 ? (
              <Line data={lineData} options={{ maintainAspectRatio: false }} />
            ) : (
              <p className="mt-24 text-gray-500 text-center">No trend data to show.</p>
            )}
          </div>
        </div>
      </div>
      <TransactionForm onTransactionAdded={handleDataChange} />

      {/* FILTERS COMPONENT */}
      <Filters 
        selectedCategory={filterCategory} 
        setSelectedCategory={setFilterCategory}
        selectedDate={filterDate}
        setSelectedDate={setFilterDate}
      />
      

      {/* TRANSACTION TABLE COMPONENT */}
      <TransactionTable 
        transactions={transactions}
        handleDelete={handleDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        isLoading={isLoading}
      />
      
    </div>
  );
}