import {
  FaHamburger,
  FaHome,
  FaMoneyBillWave,
  FaGamepad,
  FaQuestionCircle
} from "react-icons/fa";

export default function TransactionTable({ 
  transactions = [], // GÜNCELLEME BURADA: Eğer veri gelmezse çökmemesi için varsayılan olarak boş dizi [] atadık.
  handleDelete,
  currentPage,
  totalPages,
  setCurrentPage,
  isLoading
}) {
  
  return (
    <div>
      <h3 className="
    bg-white/80
    backdrop-blur-md
    rounded-2xl
    shadow-lg
    p-6
    font-extrabold
    text-black
">
    Transaction History
</h3>
      
      {/* Scrollable container for the table */}
      <div className="
    max-h-100
    overflow-y-auto
    border
    border-gray-200
    rounded-2xl
    shadow-md
    bg-white
">
        <table className="w-full text-left border-collapse">
          
          {/* Sticky header to keep column names visible while scrolling */}
          <thead className="sticky top-0 bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-gray-700 font-semibold">Description</th>
              <th className="px-6 py-4 text-gray-700 font-semibold">Amount</th>
              <th className="px-6 py-4 text-gray-700 font-semibold">Date</th>
              <th className="px-6 py-4 text-gray-700 font-semibold">Action</th>
            </tr>
          </thead>
          
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '8px', textAlign: 'center' }}>
                  No transactions match your filters.
                </td>
              </tr>
            ) : (
              // Map through the transactions passed from the Dashboard component
              transactions.map((t) => (
                <tr
  key={t._id}
  className="hover:bg-gray-50 transition"
>
                  <td className="px-6 py-4">
  <div className="font-semibold">
    {t.description || "No Description"}
  </div>

  <span
    className={`
      inline-flex
      items-center
      gap-2
      mt-2
      px-3
      py-1
      rounded-full
      text-xs
      font-medium

      ${
        t.category === "food"
          ? "bg-orange-100 text-orange-700"

          : t.category === "rent"
          ? "bg-blue-100 text-blue-700"

          : t.category === "salary"
          ? "bg-green-100 text-green-700"

          :t.category === "investment"
          ? "bg-green-100 text-green-700"

          :t.category === "freelance"

          ? "bg-green-100 text-green-700"

          : t.category === "entertainment"
          ? "bg-purple-100 text-purple-700"

          : "bg-gray-100 text-gray-700"
      }
    `}
  >
    {t.category === "food" && <FaHamburger />}

    {t.category === "rent" && <FaHome />}

    {t.category === "salary" && <FaMoneyBillWave />}
    {t.category === "investment" && <FaMoneyBillWave />}
    {t.category === "freelance" && <FaMoneyBillWave />}

    {t.category === "entertainment" && <FaGamepad />}

    {t.category === "other" && <FaQuestionCircle />}

    {t.category.charAt(0).toUpperCase() + t.category.slice(1)}
  </span>
</td>
                  
                  {/* Dynamically style the amount: red for expenses, green for income */}
                  <td style={{ padding: '8px', color: t.type === 'expense' ? 'red' : 'green', fontWeight: 'bold' }}>
                    {t.type === 'expense' ? '-' : '+'}₺{t.amount}
                  </td>
                  
                  <td style={{ padding: '8px' }}>
                    {new Date(t.date || t.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  
                  <td style={{ padding: '8px' }}>
                    <button 
                      onClick={() => handleDelete(t._id)}
                      className="
    bg-red-500
    hover:bg-red-600
    text-white
    px-4
    py-2
    rounded-lg
    transition
    cursor-pointer
"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION CONTROLS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
        
        {/* Previous Page Button */}
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
          disabled={currentPage === 1 || isLoading}
          style={{ padding: '5px 15px', cursor: (currentPage === 1 || isLoading) ? 'not-allowed' : 'pointer', opacity: (currentPage === 1 || isLoading) ? 0.5 : 1 }}
        >
          &larr; Previous
        </button>
        
        {/* Current Page Indicator */}
        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
          Page {currentPage} / {totalPages}
        </span>
        
        {/* Next Page Button */}
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
          disabled={currentPage === totalPages || isLoading}
          style={{ padding: '5px 15px', cursor: (currentPage === totalPages || isLoading) ? 'not-allowed' : 'pointer', opacity: (currentPage === totalPages || isLoading) ? 0.5 : 1 }}
        >
          Next &rarr;
        </button>

      </div>
    </div>
  );
}