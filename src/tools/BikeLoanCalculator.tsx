"use client";

import LoanTypeCalculator from "./loans/LoanTypeCalculator";

export default function BikeLoanCalculator() {
  return (
    <LoanTypeCalculator
      config={{ amountLabel: "Bike loan amount", defaultAmount: "120000", defaultRate: "11", defaultYears: "3" }}
    />
  );
}
