"use client";

import RuleOfN from "./finance/RuleOfN";

export default function RuleOf144() {
  return <RuleOfN config={{ divisor: 144, action: "quadruple", multiple: 4 }} />;
}
