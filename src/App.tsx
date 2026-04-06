import Dashboard from "./components/Dashboard";
import ExpenseTracker from "./components/ExpenseTracker";
import Optimizer from "./components/Optimiser";
import { useState } from "react";

export default function App() {
  const [totalExpenses, setTotalExpenses] = useState(0);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-8xl font-bold text-center font-stretch-50%">
        H&W Frontier
      </h1>
      <p className="font-bold text-center -m-5 text-gray-500 font-stretch-50%">Optimizing the variables of wealth</p>
      <Dashboard expenses={totalExpenses} />
      <ExpenseTracker setTotalExpenses={setTotalExpenses} />
      <Optimizer />
    </div>
  );
}