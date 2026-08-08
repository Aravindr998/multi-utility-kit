"use client";

import RuleOfN from "./finance/RuleOfN";

export default function RuleOf72() {
  return <RuleOfN config={{ divisor: 72, action: "double", multiple: 2 }} />;
}
