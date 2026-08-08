"use client";

import LoanTypeCalculator from "./loans/LoanTypeCalculator";

export default function EducationLoanCalculator() {
  return (
    <LoanTypeCalculator
      config={{ amountLabel: "Education loan amount", defaultAmount: "1000000", defaultRate: "10.5", defaultYears: "8" }}
    />
  );
}
