export default function Filters({
  selectedCategory, setSelectedCategory,
  selectedDate, setSelectedDate
}) {
  return (
    <div style={{
      padding: '15px',
      border: '1px sold #ccc',
      marginBottom: '20px',
      display:'flex',
      gap: '20px',
      alignItems: 'center',
      backgroundColor: '#f9f9f9'
    }}>
      <h4 style= {{ margin: 0}}>Filters:</h4>
      <div>
        <label style= {{marginRight: '10px'}}>Category:</label>
        <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="food">Food</option>
          <option value="rent">Rent</option>
          <option value="salary">Salary</option>
          <option value="entertainment">Entertainment</option>
          <option value="other">Other</option>
        </select>
        </div>
        <div>
          <label stle={{ marginRight: '10px'}}>Date:</label>
          <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}/>
          {selectedDate &&(
            <button
            onClick={() =>setSelectedDate('')}
            style={{marginLeft: '10px', cursor: 'pointer'}}>
              Clear Date
            </button>
          )}
        </div>
</div>
  );
    
}