"use client";

import dynamic from "next/dynamic";

const UsecaseDescriptionPage = dynamic(
  () => import("./UsecaseDescriptionPage"),
  { ssr: false }
);

export default function Page() {
  return <UsecaseDescriptionPage />;
}
