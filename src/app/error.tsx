"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div style={{ color: "#000" }}>
      <p>Something went wrong!</p>
      <button onClick={() => reset()}>Reset error boundary</button>
      <pre>{error.stack}</pre>
    </div>
  );
}
