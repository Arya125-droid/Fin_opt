import { useState } from "react";

interface DashboardProps {
  expenses: number;
}

export default function Dashboard({ expenses }: DashboardProps) {
  const [income, setIncome] = useState<number | "">("");

  // Helper for formatting numbers to Indian Currency (₹)
  const formatINR = (num: number | "") => {
    const value = num === "" ? 0 : num;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const currentIncome = income === "" ? 0 : income;
  const netWorth = currentIncome - expenses;

  return (
    <div className="p-6 bg-gray-50 rounded-xl border mt-12 border-gray-200 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Financial Overview</h2>
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-500 uppercase">Monthly Income </label>
          <input
            type="number"
            placeholder="Enter Income"
            className="border-b-2 border-blue-500 bg-transparent py-1 text-lg focus:outline-none w-xl"
            value={income}
            onChange={(e) => setIncome(e.target.value === "" ? "" : Number(e.target.value))}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Income Card */}
        <div className="bg-white p-4 rounded-lg border-l-4 border-green-500 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Total Income</p>
          <p className="text-xl font-bold text-green-600">{formatINR(currentIncome)}</p>
        </div>

        {/* Expenses Card */}
        <div className="bg-white p-4 rounded-lg border-l-4 border-red-500 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Total Expenses</p>
          <p className="text-xl font-bold text-red-600">{formatINR(expenses)}</p>
        </div>

        {/* Net Worth Card */}
        <div className={`p-4 rounded-lg border-l-4 shadow-sm ${netWorth >= 0 ? 'border-blue-500 bg-blue-50' : 'border-orange-500 bg-orange-50'}`}>
          <p className="text-sm text-gray-500 font-medium">Net Savings</p>
          <p className={`text-xl font-bold ${netWorth >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
            {formatINR(netWorth)}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between text-xs mb-1 font-semibold text-gray-600">
          <span>SAVINGS RATE: </span>
          <span>{currentIncome > 0 ? ((netWorth / currentIncome) * 100).toFixed(1) : 0}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${Math.max(0, Math.min(100, (netWorth / (currentIncome || 1)) * 100))}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}