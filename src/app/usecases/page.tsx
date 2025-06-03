"use client";

import dynamic from "next/dynamic";

const UseCasePage = dynamic(() => import("./UseCasePage"), {
  ssr: false,
});

export default function Page() {
  return <UseCasePage />;
}
