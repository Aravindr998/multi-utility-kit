"use client";

import HashTool from "@/components/HashTool";

export default function HashGenerator() {
  return <HashTool algos={["MD5", "SHA-1", "SHA-256", "SHA-512"]} />;
}
