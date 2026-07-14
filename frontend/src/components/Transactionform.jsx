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
    <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">
    ➕ Add New Transaction
</h3>
<p className="text-gray-500 mb-6">
    Add your income and expenses here.
</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
        
        <div>
          <label>Description: </label>
          <input
    type="text"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    className="
        w-full
        border
        border-gray-300
        rounded-xl
        px-4
        py-3
        focus:outline-none
        focus:ring-2
        focus:ring-emerald-500
    "
/>
        </div>

        <div>
          <label>Amount (₺): </label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            required 
             className="
        w-full
        border
        border-gray-300
        rounded-xl
        px-4
        py-3
        focus:outline-none
        focus:ring-2
        focus:ring-emerald-500
    "
          />
        </div>

        <div>
          <label>Type: </label>
          {/* We use our custom handleTypeChange function here instead of a direct setState */}
          <select value={type} onChange={handleTypeChange}
           className="
        w-full
        border
        border-gray-300
        rounded-xl
        px-4
        py-3
        focus:outline-none
        focus:ring-2
        focus:ring-emerald-500
    ">
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div>
          <label>Category: </label>
          <select 
          value={category} onChange={(e) => setCategory(e.target.value)}
          
           className="
        w-full
        border
        border-gray-300
        rounded-xl
        px-4
        py-3
        focus:outline-none
        focus:ring-2
        focus:ring-emerald-500
    ">
            
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

        <button
  type="submit"
  className="
    bg-emerald-500
    hover:bg-emerald-600
    text-white
    px-6
    py-3
    rounded-xl
    font-semibold
    transition
    cursor-pointer
  "
>
          Save Transaction
        </button>

      </form>
    </div>
  );
}