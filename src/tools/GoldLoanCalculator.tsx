"use client";

import LoanTypeCalculator from "./loans/LoanTypeCalculator";

export default function GoldLoanCalculator() {
  return (
    <LoanTypeCalculator
      config={{ amountLabel: "Gold loan amount", defaultAmount: "200000", defaultRate: "12", defaultYears: "2" }}
    />
  );
}
