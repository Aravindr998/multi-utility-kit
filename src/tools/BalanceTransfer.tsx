"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, Stat, money } from "./finance/shared";

/** Pay down a balance with a monthly payment; APR can change after promoMonths. */
function payoff(balance: number, aprPct: number, payment: number, promoMonths = Infinity, postApr = aprPct) {
  let bal = balance;
  let months = 0;
  let interestPaid = 0;
  while (bal > 0.01 && months < 1200) {
    const apr = months < promoMonths ? aprPct : postApr;
    const r = apr / 100 / 12;
    const interest = bal * r;
    let pay = payment;
    if (pay <= interest) return { never: true as const };
    if (pay > bal + interest) pay = bal + interest;
    interestPaid += interest;
    bal = bal + interest - pay;
    months++;
  }
  return { never: false as const, months, interestPaid };
}

export default function BalanceTransfer() {
  const [balance, setBalance] = useState("150000");
  const [curApr, setCurApr] = useState("36");
  const [promoApr, setPromoApr] = useState("0");
  const [promoMonths, setPromoMonths] = useState("6");
  const [postApr, setPostApr] = useState("30");
  const [feePct, setFeePct] = useState("2");
  const [payment, setPayment] = useState("15000");

  const result = useMemo(() => {
    const b = parseFloat(balance);
    const ca = parseFloat(curApr);
    const pa = parseFloat(promoApr);
    const pm = parseFloat(promoMonths);
    const post = parseFloat(postApr);
    const fp = parseFloat(feePct) || 0;
    const pay = parseFloat(payment);
    if ([b, ca, pa, pm, post, pay].some((v) => isNaN(v)) || b <= 0 || pay <= 0) return null;

    const stay = payoff(b, ca, pay);
    const fee = b * (fp / 100);
    const transfer = payoff(b + fee, pa, pay, Math.round(pm), post);
    if (stay.never || transfer.never) return { error: true as const };

    const stayCost = b + stay.interestPaid;
    const transferCost = b + fee + transfer.interestPaid;
    return {
      error: false as const,
      stay,
      transfer,
      fee,
      stayCost,
      transferCost,
      savings: stayCost - transferCost,
    };
  }, [balance, curApr, promoApr, promoMonths, postApr, feePct, payment]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Balance to transfer" htmlFor="bt-bal">
          <input id="bt-bal" type="number" className="input" value={balance} onChange={(e) => setBalance(e.target.value)} />
        </Field>
        <Field label="Current APR (%)" htmlFor="bt-cur">
          <input id="bt-cur" type="number" step="0.1" className="input" value={curApr} onChange={(e) => setCurApr(e.target.value)} />
        </Field>
        <Field label="Monthly payment" htmlFor="bt-pay">
          <input id="bt-pay" type="number" className="input" value={payment} onChange={(e) => setPayment(e.target.value)} />
        </Field>
        <Field label="Transfer fee (%)" htmlFor="bt-fee">
          <input id="bt-fee" type="number" step="0.1" className="input" value={feePct} onChange={(e) => setFeePct(e.target.value)} />
        </Field>
        <Field label="Promo APR (%)" htmlFor="bt-promo" hint="often 0%">
          <input id="bt-promo" type="number" step="0.1" className="input" value={promoApr} onChange={(e) => setPromoApr(e.target.value)} />
        </Field>
        <Field label="Promo period (months)" htmlFor="bt-pm">
          <input id="bt-pm" type="number" className="input" value={promoMonths} onChange={(e) => setPromoMonths(e.target.value)} />
        </Field>
        <Field label="Post-promo APR (%)" htmlFor="bt-post">
          <input id="bt-post" type="number" step="0.1" className="input" value={postApr} onChange={(e) => setPostApr(e.target.value)} />
        </Field>
      </div>

      {result && result.error && (
        <div className="card p-4 text-sm" style={{ color: "var(--danger, #d33)" }}>
          Your monthly payment doesn&apos;t cover the interest on one of the scenarios — increase it to compare payoff.
        </div>
      )}

      {result && !result.error && (
        <>
          <BigResult
            label={result.savings >= 0 ? "You'd save by transferring" : "Transferring costs more"}
            value={money(Math.abs(result.savings))}
            sub={result.savings >= 0 ? "net of the transfer fee" : "after the transfer fee"}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card p-4">
              <h3 className="mb-2 font-semibold" style={{ color: "var(--accent)" }}>Stay on current card</h3>
              <div className="space-y-1 text-sm">
                <Row label="Payoff time" value={`${result.stay.months} months`} />
                <Row label="Interest paid" value={money(result.stay.interestPaid)} />
                <Row label="Total cost" value={money(result.stayCost)} />
              </div>
            </div>
            <div className="card p-4">
              <h3 className="mb-2 font-semibold" style={{ color: "var(--brand)" }}>Transfer to new card</h3>
              <div className="space-y-1 text-sm">
                <Row label="Payoff time" value={`${result.transfer.months} months`} />
                <Row label="Interest paid" value={money(result.transfer.interestPaid)} />
                <Row label="Transfer fee" value={money(result.fee)} />
                <Row label="Total cost" value={money(result.transferCost)} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
