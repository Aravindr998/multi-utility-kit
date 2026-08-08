"use client";

import LoanTypeCalculator from "./loans/LoanTypeCalculator";

export default function HomeLoanCalculator() {
  return (
    <LoanTypeCalculator
      config={{ amountLabel: "Home loan amount", defaultAmount: "3000000", defaultRate: "8.5", defaultYears: "20" }}
    />
  );
}
