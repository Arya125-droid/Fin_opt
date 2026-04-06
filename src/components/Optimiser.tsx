import { useEffect, useState } from "react";
import { optimizePortfolio } from "../services/api";

export default function Optimizer() {
  const [income, setIncome] = useState<number>(0);
  const [risk, setRisk] = useState<number>(0.5);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleOptimize = async () => {
    if (!income) return;
    try {
      setLoading(true);
      const res = await optimizePortfolio({ income, risk });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleOptimize();
  }, [risk, income]);

  // Helper for Indian numbering system
  const formatCurrency = (num: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);

  return (
    <div className="mx-auto my-10 p-8 bg-white rounded-3xl border border-gray-100 shadow-2xl font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-gray-50 pb-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Investment Optimizer</h2>
          <p className="text-gray-400 font-medium">Efficient Frontier & Asset Allocation</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Status</span>
          <span className={`text-sm font-bold ${loading ? 'text-blue-500' : 'text-green-500'}`}>
            {loading ? '● Calculating...' : '● Live'}
          </span>
        </div>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Investable Capital</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₹</span>
            <input
              type="number"
              placeholder="Enter Amount"
              className="w-full pl-10 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all text-xl font-bold text-gray-800"
              onChange={(e) => setIncome(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Risk Tolerance</label>
            <span className="font-black text-blue-600">{risk.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={risk}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-4"
            onChange={(e) => setRisk(Number(e.target.value))}
          />
          <div className="flex justify-between text-[10px] text-gray-400 font-bold px-1">
            <span>CONSERVATIVE</span>
            <span>AGGRESSIVE</span>
          </div>
        </div>
      </div>

      {/* Result Section */}
      {result && !loading ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-blue-600 p-8 rounded-2xl text-white shadow-lg shadow-blue-100 flex justify-between items-center">
            <div>
              <p className="text-blue-100 text-sm font-bold uppercase tracking-widest mb-1">Expected Annual Return</p>
              <h3 className="text-5xl font-black">{(result.expected_return * 100).toFixed(2)}%</h3>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-blue-100 text-xs font-bold uppercase mb-1">Total Capital</p>
              <p className="text-2xl font-bold">{formatCurrency(result.income)}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
              Portfolio Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(result.allocation).map(([key, value]) => {
                const val = value as any;
                return (
                  <div key={key} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-blue-200 transition-colors group">
                    <div className="flex justify-between items-center mb-4">
                      <p className="font-black text-gray-700 text-lg group-hover:text-blue-600 transition-colors">{key}</p>
                      <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-black">
                        {(val.percentage * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Invest Amount</p>
                        <p className="text-xl font-black text-gray-900">{formatCurrency(val.amount)}</p>
                      </div>
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${val.percentage * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        !loading && (
          <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-2xl">
            <p className="text-gray-300 font-medium italic text-lg">
              Enter your capital to generate your <br /> optimized investment strategy.
            </p>
          </div>
        )
      )}

      {/* Manual Trigger Button */}
      <div className="mt-10">
        <button 
          onClick={handleOptimize} 
          disabled={loading || !income}
          className="w-full py-5 bg-gray-900 hover:bg-blue-600 text-white rounded-2xl font-black text-lg transition-all shadow-xl active:scale-95 disabled:bg-gray-200 disabled:shadow-none"
        >
          {loading ? 'Re-calculating Math...' : 'Optimize Portfolio'}
        </button>
      </div>
    </div>
  );
}