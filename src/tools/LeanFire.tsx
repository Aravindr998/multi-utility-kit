"use client";

import FireCalculator from "./savings/FireCalculator";

export default function LeanFire() {
  return (
    <FireCalculator
      config={{
        targetLabel: "Your Lean FIRE number",
        expensesLabel: "Lean annual expenses",
        defaultExpenses: "600000",
        defaultWithdrawal: "4",
        currentLabel: "Current investments",
        note: "Lean FIRE targets financial independence on a frugal, minimal budget — a smaller corpus, reached sooner, but with a tighter lifestyle.",
      }}
    />
  );
}
