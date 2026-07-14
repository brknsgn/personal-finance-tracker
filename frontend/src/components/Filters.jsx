export default function Filters({
  selectedCategory, setSelectedCategory,
  selectedDate, setSelectedDate
}) {
  return (
  <div className="
    bg-white
    shadow-md
    rounded-2xl
    p-6
    mb-6
    flex
    flex-wrap
    gap-6
    items-center
">
    
      
      {/* Category Dropdown Filter */}
      <div>
        <label style={{ marginRight: '10px' }}>Category:</label>
        <select
  value={selectedCategory}
  onChange={(e) => setSelectedCategory(e.target.value)}
  className="
    border
    border-gray-300
    rounded-xl
    px-4
    py-2
    focus:outline-none
    focus:ring-2
    focus:ring-emerald-500
  "
>
          <option value="all">All Categories</option>
          <option value="food">Food</option>
          <option value="rent">Rent</option>
          <option value="salary">Salary</option>
          <option value="entertainment">Entertainment</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Date Picker Filter */}
      <div>
        <label style={{ marginRight: '10px' }}>Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="
    border
    border-gray-300
    rounded-xl
    px-4
    py-2
    focus:outline-none
    focus:ring-2
    focus:ring-emerald-500
"
        />
        
        {/* Render a "Clear Date" button only if a date is currently selected */}
        {selectedDate && (
          <button
  onClick={() => setSelectedDate('')}
  className="
      ml-3
      px-3
      py-2
      bg-gray-200
      hover:bg-gray-300
      rounded-lg
      transition
      cursor-pointer
  "
>
            Clear Date
          </button>
        )}
      </div>
    </div>
  );
}