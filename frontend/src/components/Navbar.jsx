import { FaWallet } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-8 py-4">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">
                💰 Personal Finance Tracker
            </h1>

            <p className="text-sm text-gray-500">
                Manage your income and expenses.
            </p>
         
            
        </div>
        
<div className="text-right">
    <p className="text-sm text-gray-500">
        {new Date().toLocaleDateString("en-US", {
            month: "long",
            year: "numeric"
        })}
    </p>

    <p className="text-xs text-emerald-500 mt-1">
    ● Live Dashboard
</p>
</div>
    </div>
</nav>
  )
}