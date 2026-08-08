"use client";

import LoanTypeCalculator from "./loans/LoanTypeCalculator";

export default function BusinessLoanCalculator() {
  return (
    <LoanTypeCalculator
      config={{ amountLabel: "Business loan amount", defaultAmount: "2000000", defaultRate: "15", defaultYears: "5" }}
    />
  );
}
