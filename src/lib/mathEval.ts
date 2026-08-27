// ---------------------------------------------------------------------------
// Tiny safe arithmetic evaluator for the command bar.
// Recursive-descent parser — no eval/Function — supporting + - * / % ^,
// parentheses, unary minus, a few functions and constants. Returns null for
// anything it doesn't fully understand, so plain words never "calculate".
// ---------------------------------------------------------------------------

const FUNCS: Record<string, (x: number) => number> = {
  sqrt: Math.sqrt,
  abs: Math.abs,
  round: Math.round,
  floor: Math.floor,
  ceil: Math.ceil,
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  log: Math.log10,
  ln: Math.log,
};
const CONSTS: Record<string, number> = { pi: Math.PI, e: Math.E };

type Tok = { t: "num"; v: number } | { t: "op"; v: string } | { t: "name"; v: string };

function tokenize(s: string): Tok[] | null {
  const toks: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === " " || c === "\t") {
      i++;
    } else if (/[0-9.]/.test(c)) {
      let j = i + 1;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      const v = parseFloat(s.slice(i, j));
      if (!isFinite(v)) return null;
      toks.push({ t: "num", v });
      i = j;
    } else if (/[a-z]/i.test(c)) {
      let j = i + 1;
      while (j < s.length && /[a-z]/i.test(s[j])) j++;
      toks.push({ t: "name", v: s.slice(i, j).toLowerCase() });
      i = j;
    } else if ("+-*/%^()".includes(c)) {
      toks.push({ t: "op", v: c });
      i++;
    } else {
      return null; // unknown char → not math
    }
  }
  return toks;
}

/** Evaluate a basic math expression, or null if it isn't valid math. */
export function evalMath(input: string): number | null {
  const toks = tokenize(input);
  if (!toks || toks.length === 0) return null;

  let pos = 0;
  const peek = () => toks[pos];
  const eat = () => toks[pos++];

  // Full precedence chain with left-assoc +/- and */%, right-assoc ^.
  function parseAddSub(): number {
    let v = parseMulDiv();
    while (peek()?.t === "op" && "+-".includes((peek() as { v: string }).v)) {
      const op = (eat() as { v: string }).v;
      const rhs = parseMulDiv();
      v = op === "+" ? v + rhs : v - rhs;
    }
    return v;
  }
  function parseMulDiv(): number {
    let v = parsePow();
    while (peek()?.t === "op" && "*/%".includes((peek() as { v: string }).v)) {
      const op = (eat() as { v: string }).v;
      const rhs = parsePow();
      v = op === "*" ? v * rhs : op === "/" ? v / rhs : v % rhs;
    }
    return v;
  }
  function parsePow(): number {
    const v = parseUnary();
    if (peek()?.t === "op" && (peek() as { v: string }).v === "^") {
      eat();
      return Math.pow(v, parsePow()); // right-associative
    }
    return v;
  }
  function parseUnary(): number {
    if (peek()?.t === "op" && "+-".includes((peek() as { v: string }).v)) {
      const op = (eat() as { v: string }).v;
      const v = parseUnary();
      return op === "-" ? -v : v;
    }
    return parseAtom();
  }
  function parseAtom(): number {
    const tk = peek();
    if (!tk) throw new Error("unexpected end");
    if (tk.t === "num") {
      eat();
      return tk.v;
    }
    if (tk.t === "op" && tk.v === "(") {
      eat();
      const v = parseAddSub();
      const close = eat();
      if (!close || close.t !== "op" || close.v !== ")") throw new Error("expected )");
      return v;
    }
    if (tk.t === "name") {
      eat();
      if (tk.v in CONSTS) return CONSTS[tk.v];
      if (tk.v in FUNCS) {
        const open = eat();
        if (!open || open.t !== "op" || open.v !== "(") throw new Error("expected (");
        const arg = parseAddSub();
        const close = eat();
        if (!close || close.t !== "op" || close.v !== ")") throw new Error("expected )");
        return FUNCS[tk.v](arg);
      }
      throw new Error("unknown name");
    }
    throw new Error("unexpected token");
  }

  try {
    const result = parseAddSub();
    if (pos !== toks.length) return null; // trailing junk → not valid
    return isFinite(result) ? result : null;
  } catch {
    return null;
  }
}

/** True if the expression actually uses math (so bare numbers/words don't match). */
export function looksLikeMath(input: string): boolean {
  const s = input.trim();
  if (!/[0-9]/.test(s)) return false;
  // needs an operator or a known function/const to count as a calculation
  return /[+\-*/%^]/.test(s) || /\b(sqrt|abs|round|floor|ceil|sin|cos|tan|log|ln|pi|e)\b/i.test(s);
}
