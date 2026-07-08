import { useState, useEffect } from 'react';

export default function TransactionTable() {
 
  // 1. STATE MANAGEMENT 

  
  // useState allows this component to remember data between renders.
  // 'transactions' will hold the array of data coming from the backend.
  // 'setTransactions' is the function we use to update this array.
  const [transactions, setTransactions] = useState([]); 
  
  // 'isLoading' tracks whether the data is currently being fetched. 
  // It starts as 'true' because the fetching process begins immediately when the page loads.
  const [isLoading, setIsLoading] = useState(true); 
  
  // 'error' will store any error message if the backend request fails.
  const [error, setError] = useState(null); 

  // 2. DATA FETCHING / SIDE EFFECTS 
  
  // useEffect is used to perform operations that reach outside the component (like API calls).
  useEffect(() => {
    
    // We cannot make the main useEffect function 'async' directly.
    // Instead, we create an internal async function and call it immediately.
    // This is the standard React pattern for fetching data inside useEffect.
    const fetchTransactions = async () => {
      try {
        // Send a GET request to the backend server.
        const response = await fetch('http://localhost:3000/transactions');
        
        // IMPORTANT: The fetch() API does not automatically throw an error for HTTP issues (like 404 or 500).
        // It only rejects on total network failure. Therefore, we manually check if response.ok is false.
        if (!response.ok) {
          throw new Error('Failed to fetch data from the server. Please check your backend.');
        }

        // Convert the raw HTTP response into a readable JavaScript object/array.
        const data = await response.json();
        
        // Update our state with the fetched data. 
        // We use 'data.data || data' to support different backend response structures.
        setTransactions(data.data || data); 
        
      } catch (err) {
        // If the fetch fails (e.g., backend is offline) or our manual error is thrown, it is caught here.
        // We save the error message to the state so we can display it to the user.
        setError(err.message);
      } finally {
        // The 'finally' block executes regardless of whether the try block succeeded or failed.
        // We use it to turn off the loading indicator once the process is completely finished.
        setIsLoading(false);
      }
    };

    // Execute the internal async function we just defined above.
    fetchTransactions(); 
    
  }, []); 
  // WARNING: The empty dependency array [] at the end is CRITICAL.
  // It tells React: "Only run this useEffect ONCE when the component first appears on the screen (mounts)."
  // If you forget to add this array, React will fetch data infinitely in a loop, crashing your app.

  // 3. CONDITIONAL RENDERING 

  // State 1: Loading Indicator
  // If isLoading is true, we stop rendering the rest of the component and show this instead.
  if (isLoading) {
    return <div>Loading transactions, please wait...</div>;
  }

  // State 2: Error Message
  // If the error state is not null, something went wrong. Display the error in red.
  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  // State 3: Empty State
  // The data fetched successfully, but the user has no transactions yet (array is empty).
  if (transactions.length === 0) {
    return <div>No transactions found. Add your first expense!</div>;
  }

  // State 4: Data Display
  // If the code passes all the checks above, it means data exists and is ready to be shown.
  return (
    <div>
      <h3>Transaction History</h3>
      <table border="1" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {/* 
            We use the .map() array method to loop over each transaction.
            For every transaction (t), we return a table row (<tr>).
            The 'key' prop is mandatory in React when rendering lists; it helps React track which items change/delete.
          */}
          {transactions.map((t) => (
            <tr key={t._id}>
              <td>{t.description || 'No Description'}</td>
              <td>₺{t.amount}</td>
              {/* Format the date to look clean (e.g., 20.10.2023) */}
              <td>{new Date(t.date || t.createdAt).toLocaleDateString('tr-TR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}