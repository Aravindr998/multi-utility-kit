"use client";

import LoanTypeCalculator from "./loans/LoanTypeCalculator";

export default function CarLoanCalculator() {
  return (
    <LoanTypeCalculator
      config={{ amountLabel: "Car loan amount", defaultAmount: "800000", defaultRate: "9.5", defaultYears: "7" }}
    />
  );
}
