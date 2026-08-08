"use client";

import { useMemo, useState } from "react";
import { BigResult, Field, Stat, money, pct } from "./finance/shared";

export default function AbsoluteReturn() {
  const [invested, setInvested] = useState("100000");
  const [current, setCurrent] = useState("145000");

  const result = useMemo(() => {
    const inv = parseFloat(invested);
    const cur = parseFloat(current);
    if (isNaN(inv) || isNaN(cur) || inv <= 0) return null;
    const gain = cur - inv;
    const ret = (gain / inv) * 100;
    return { gain, ret, multiple: cur / inv };
  }, [invested, current]);

  return (
    <div className="space-y-4">
      <div className="card grid gap-4 p-5 sm:grid-cols-2">
        <Field label="Amount invested" htmlFor="ar-inv">
          <input id="ar-inv" type="number" className="input" value={invested} onChange={(e) => setInvested(e.target.value)} />
        </Field>
        <Field label="Current / final value" htmlFor="ar-cur">
          <input id="ar-cur" type="number" className="input" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </Field>
      </div>

      {result && (
        <>
          <BigResult label="Absolute return" value={pct(result.ret)} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Stat label={result.gain >= 0 ? "Total gain" : "Total loss"} value={money(result.gain)} />
            <Stat label="Growth multiple" value={`${result.multiple.toFixed(2)}×`} />
          </div>
        </>
      )}
    </div>
  );
}
