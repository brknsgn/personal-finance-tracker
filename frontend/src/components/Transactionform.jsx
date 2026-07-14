import { useState } from 'react';

export default function TransactionForm({ onTransactionAdded }) {
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  
  const [type, setType] = useState('expense'); 
  const [category, setCategory] = useState('food'); 

  // Custom handler for when the 'Type' changes.
  // We need this because when the type changes from Expense to Income,
  // we must also reset the Category so it doesn't get stuck on an invalid option (like 'Food').
  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setType(selectedType);

    // Automatically set a valid default category based on the new type.
    if (selectedType === 'income') {
      setCategory('salary');
    } else {
      setCategory('food');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTransaction = {
      description: description,
      amount: Number(amount),
      type: type,             
      category: category      
    };

    try {
      const response = await fetch('https://personal-finance-tracker-avnm.onrender.com/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTransaction),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Server rejected the data.');
      }

      // Reset form after success
      setDescription('');
      setAmount('');
      setType('expense');
      setCategory('food');

      if (onTransactionAdded) {
        onTransactionAdded();
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', border: '2px solid #eee', marginBottom: '20px' }}>
      
      <h3>Add a New Transaction</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
        
        <div>
          <label>Description: </label>
          <input 
            type="text" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
            placeholder="e.g., Coffee"
          />
        </div>

        <div>
          <label>Amount (₺): </label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            required 
            placeholder="50"
          />
        </div>

        <div>
          <label>Type: </label>
          {/* We use our custom handleTypeChange function here instead of a direct setState */}
          <select value={type} onChange={handleTypeChange}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div>
          <label>Category: </label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            
            {/* 
              Conditional Rendering (Ternary Operator): 
              If type is 'expense', show these options.
              Otherwise (if 'income'), show the other options.
            */}
            {type === 'expense' ? (
              <>
                <option value="food">Food</option>
                <option value="rent">Rent</option>
                <option value="entertainment">Entertainment</option>
                <option value="other">Other</option>
              </>
            ) : (
              <>
                <option value="salary">Salary</option>
                <option value="freelance">Freelance</option>
                <option value="investment">Investment</option>
                <option value="other">Other</option>
              </>
            )}

          </select>
        </div>

        <button type="submit" style={{ padding: '5px 15px', cursor: 'pointer' }}>
          Save Transaction
        </button>

      </form>
    </div>
  );
}