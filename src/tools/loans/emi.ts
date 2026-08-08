// ---------------------------------------------------------------------------
// Shared loan math for the Loans calculators.
// ---------------------------------------------------------------------------

/** Equated Monthly Instalment for principal P, annual rate %, over n months. */
export function emi(P: number, annualRatePct: number, months: number): number {
  const r = annualRatePct / 12 / 100;
  if (months <= 0) return 0;
  if (r === 0) return P / months;
  return (P * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

/** Largest principal affordable for a given EMI, annual rate % and months. */
export function principalForEmi(targetEmi: number, annualRatePct: number, months: number): number {
  const r = annualRatePct / 12 / 100;
  if (months <= 0) return 0;
  if (r === 0) return targetEmi * months;
  return (targetEmi * (Math.pow(1 + r, months) - 1)) / (r * Math.pow(1 + r, months));
}

export type ScheduleRow = {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
};

/** Full month-by-month amortization schedule. */
export function buildSchedule(P: number, annualRatePct: number, months: number): ScheduleRow[] {
  const r = annualRatePct / 12 / 100;
  const pay = emi(P, annualRatePct, months);
  const rows: ScheduleRow[] = [];
  let balance = P;
  for (let m = 1; m <= months; m++) {
    const interest = balance * r;
    let principal = pay - interest;
    if (principal > balance) principal = balance;
    balance -= principal;
    rows.push({
      month: m,
      emi: principal + interest,
      principal,
      interest,
      balance: Math.max(0, balance),
    });
  }
  return rows;
}

export type YearRow = {
  year: number;
  principal: number;
  interest: number;
  balance: number;
};

/** Aggregate a monthly schedule into yearly totals (balance = year-end). */
export function yearlySummary(rows: ScheduleRow[]): YearRow[] {
  const out: YearRow[] = [];
  for (let i = 0; i < rows.length; i++) {
    const yr = Math.floor(i / 12);
    if (!out[yr]) out[yr] = { year: yr + 1, principal: 0, interest: 0, balance: 0 };
    out[yr].principal += rows[i].principal;
    out[yr].interest += rows[i].interest;
    out[yr].balance = rows[i].balance;
  }
  return out;
}

/** Outstanding balance after `paid` instalments of a P / rate / months loan. */
export function balanceAfter(P: number, annualRatePct: number, months: number, paid: number): number {
  const r = annualRatePct / 12 / 100;
  if (paid >= months) return 0;
  if (paid <= 0) return P;
  if (r === 0) return P - (P / months) * paid;
  const pay = emi(P, annualRatePct, months);
  // Remaining balance after `paid` payments.
  return P * Math.pow(1 + r, paid) - pay * ((Math.pow(1 + r, paid) - 1) / r);
}
