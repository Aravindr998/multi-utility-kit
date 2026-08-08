"use client";

import LoanTypeCalculator from "./loans/LoanTypeCalculator";

export default function EmiCalculator() {
  return <LoanTypeCalculator config={{ defaultAmount: "500000", defaultRate: "10", defaultYears: "5" }} />;
}
