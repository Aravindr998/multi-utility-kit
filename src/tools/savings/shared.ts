// ---------------------------------------------------------------------------
// Shared math for the Savings / FIRE calculators.
// ---------------------------------------------------------------------------

/** The FIRE "number": the corpus that funds annual expenses at a safe withdrawal rate. */
export function fireNumber(annualExpenses: number, withdrawalRatePct: number): number {
  if (withdrawalRatePct <= 0) return Infinity;
  return annualExpenses / (withdrawalRatePct / 100);
}

/** Effective monthly rate from an annual return: (1 + r)^(1/12) − 1 (see finance/shared). */
function monthlyRate(annualReturnPct: number): number {
  return Math.pow(1 + annualReturnPct / 100, 1 / 12) - 1;
}

/**
 * Years for `current` savings plus a monthly contribution (start of month) to
 * grow to `target` at an annual return. Returns Infinity if unreachable in 100y.
 */
export function yearsToReach(current: number, monthly: number, annualReturnPct: number, target: number): number {
  if (current >= target) return 0;
  const i = monthlyRate(annualReturnPct);
  let bal = current;
  for (let m = 1; m <= 1200; m++) {
    bal = (bal + monthly) * (1 + i);
    if (bal >= target) return m / 12;
  }
  return Infinity;
}

/**
 * Monthly contribution needed so `current` savings grow to `target` over `years`
 * at an annual return. Accounts for growth of the existing balance.
 */
export function monthlyForTarget(current: number, target: number, annualReturnPct: number, years: number): number {
  const n = Math.round(years * 12);
  const i = monthlyRate(annualReturnPct);
  if (n <= 0) return Math.max(0, target - current);
  const grownCurrent = current * Math.pow(1 + i, n);
  const need = Math.max(0, target - grownCurrent);
  if (need === 0) return 0;
  if (i === 0) return need / n;
  // Future value of an annuity-due of 1 per month.
  const annuityFactor = ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  return need / annuityFactor;
}

/** Format a years value (possibly Infinity) as "X.Y years" or a friendly message. */
export function yearsLabel(years: number): string {
  if (!isFinite(years)) return "Never at this rate";
  if (years === 0) return "Already there";
  const y = Math.floor(years);
  const mo = Math.round((years - y) * 12);
  if (y === 0) return `${mo} months`;
  return `${y} yr ${mo} mo`;
}
