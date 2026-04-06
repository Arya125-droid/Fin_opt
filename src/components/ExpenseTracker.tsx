import { useState } from "react";

interface Expense {
  id: number;
  amount: number;
  category: string;
  date: string;
}

interface ExpenseTrackerProps {
  setTotalExpenses: (total: number) => void;
}

const CATEGORIES = ["Food", "Transport", "Rent", "Shopping", "Entertainment", "Health", "Other"];

export default function ExpenseTracker({ setTotalExpenses }: ExpenseTrackerProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState<number | "">("");
  const [category, setCategory] = useState<string>("Food");

  const addExpense = () => {
    if (amount === "" || amount <= 0) return;

    const newExpense: Expense = {
      id: Date.now(),
      amount: amount,
      category: category,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
    };

    const updatedExpenses = [newExpense, ...expenses];
    setExpenses(updatedExpenses);
    
    // Update parent state
    const total = updatedExpenses.reduce((sum, e) => sum + e.amount, 0);
    setTotalExpenses(total);

    // Reset inputs
    setAmount("");
  };

  const deleteExpense = (id: number) => {
    const updatedExpenses = expenses.filter(e => e.id !== id);
    setExpenses(updatedExpenses);
    const total = updatedExpenses.reduce((sum, e) => sum + e.amount, 0);
    setTotalExpenses(total);
  };

  return (
    <div className="bg-white rounded-4xl border border-slate-200 shadow-xl overflow-hidden font-sans">
      {/* Header */}
      <div className="p-6 bg-slate-900 text-white">
        <h2 className="text-xl font-black tracking-tight">Expense Logger</h2>
        <p className="text-slate-400 text-xs font-bold uppercase mt-1">Track Daily Burn Rate</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Input Controls */}
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
              <input
                type="number"
                className="w-full pl-8 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none font-bold text-lg transition-all"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
            <select 
              className="w-full p-3 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none font-bold text-slate-700 transition-all cursor-pointer"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <button 
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-sm hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
            onClick={addExpense}
          >
            ADD TRANSACTION
          </button>
        </div>

        {/* Transactions List */}
        <div className="pt-6 border-t border-slate-100">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Recent History</h3>
          
          <div className="space-y-3 max-h-75 overflow-y-auto pr-2 custom-scrollbar">
            {expenses.length === 0 ? (
              <div className="text-center py-10 opacity-30 italic text-sm">No transactions yet</div>
            ) : (
              expenses.map((e) => (
                <div key={e.id} className="group flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-200 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-lg">
                      {getIcon(e.category)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{e.category}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{e.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-black text-slate-900 text-base">₹{e.amount.toLocaleString()}</p>
                    <button 
                      onClick={() => deleteExpense(e.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper for Category Icons
function getIcon(category: string) {
  switch (category) {
    case "Food": return "🍔";
    case "Transport": return "🚗";
    case "Rent": return "🏠";
    case "Shopping": return "🛍️";
    case "Health": return "💊";
    default: return "💰";
  }
}