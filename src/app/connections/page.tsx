import React, { Suspense } from "react";
import ConnectionsClient from "./ConnectionsClient";


export default function ConnectionsPage() {
  return (
    <Suspense fallback={<div>Loading connections...</div>}>
      <ConnectionsClient />
    </Suspense>
  );
}
