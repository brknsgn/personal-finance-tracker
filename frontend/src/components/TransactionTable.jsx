import { useState, useEffect } from 'react';

export default function TransactionTable({ refreshTrigger }) {
  
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('http://localhost:3000/transactions');
        
        if (!response.ok) {
          throw new Error('Failed to fetch data from the server.');
        }

        const data = await response.json();
        setTransactions(data.data || data); 
        
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions(); 
  }, [refreshTrigger]); 

  if (isLoading) return <div>Loading transactions, please wait...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (transactions.length === 0) return <div>No transactions found. Add your first expense!</div>;

  return (
    <div>
      <h3>Transaction History</h3>
      {/* Added borderCollapse for a cleaner table look */}
      <table border="1" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '8px' }}>Description</th>
            <th style={{ padding: '8px' }}>Amount</th>
            <th style={{ padding: '8px' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t._id}>
              
              <td style={{ padding: '8px' }}>
                {t.description || 'No Description'}
              </td>
              
              {/* 
                CONDITIONAL STYLING (The Magic Happens Here)
                We use a ternary operator (? :) to check the transaction type.
                If t.type is 'expense', make the text red. Otherwise, make it green.
              */}
              <td style={{ 
                padding: '8px',
                color: t.type === 'expense' ? 'red' : 'green',
                fontWeight: 'bold'
              }}>
                {/* 
                  CONDITIONAL RENDERING FOR THE SIGN
                  Print '-' if expense, '+' if income, followed by the amount.
                */}
                {t.type === 'expense' ? '-' : '+'}₺{t.amount}
              </td>
              
              <td style={{ padding: '8px' }}>
                {new Date(t.date || t.createdAt).toLocaleDateString('en-US')}
              </td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}