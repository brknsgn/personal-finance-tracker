import { useState } from 'react'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import TransactionForm from './components/TransactionForm'
import Filters from './components/Filters'
import TransactionTable from './components/TransactionTable'

function App() {

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTransactionAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  
  };

  return (
    <div>
      <Navbar />
      <main style= {{padding: '20px'}}>
        <Dashboard />
        <TransactionForm onTransactionAdded={handleTransactionAdded} />
        <Filters />
        <TransactionTable  refreshTrigger={refreshTrigger}/>
      </main>
    </div>
  );
}

export default App;