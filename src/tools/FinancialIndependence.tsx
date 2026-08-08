"use client";

import FireCalculator from "./savings/FireCalculator";

export default function FinancialIndependence() {
  return (
    <FireCalculator
      config={{
        targetLabel: "Financial independence number",
        expensesLabel: "Annual living expenses",
        defaultExpenses: "1000000",
        defaultWithdrawal: "4",
        currentLabel: "Current net worth (investments)",
        note: "You're financially independent when your investments can cover your living expenses indefinitely at a safe withdrawal rate.",
      }}
    />
  );
}
