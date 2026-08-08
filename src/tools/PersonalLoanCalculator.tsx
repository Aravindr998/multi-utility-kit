"use client";

import LoanTypeCalculator from "./loans/LoanTypeCalculator";

export default function PersonalLoanCalculator() {
  return (
    <LoanTypeCalculator
      config={{ amountLabel: "Personal loan amount", defaultAmount: "500000", defaultRate: "14", defaultYears: "5" }}
    />
  );
}
