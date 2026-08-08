"use client";

import RuleOfN from "./finance/RuleOfN";

export default function RuleOf114() {
  return <RuleOfN config={{ divisor: 114, action: "triple", multiple: 3 }} />;
}
