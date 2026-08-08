"use client";

import FireCalculator from "./savings/FireCalculator";

export default function FireCalc() {
  return (
    <FireCalculator
      config={{
        targetLabel: "Your FIRE number",
        expensesLabel: "Annual expenses in retirement",
        defaultExpenses: "1200000",
        defaultWithdrawal: "4",
        currentLabel: "Current investments",
        note: "FIRE = Financial Independence, Retire Early. The classic rule targets 25× your annual expenses (a 4% safe withdrawal rate).",
      }}
    />
  );
}
