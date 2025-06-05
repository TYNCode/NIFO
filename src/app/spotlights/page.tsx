"use client";

import dynamic from "next/dynamic";

const SpotlightPage = dynamic(() => import("./components/SpotlightPage"), {
  ssr: false,
});

export default function Page() {
  return <SpotlightPage />;
}
