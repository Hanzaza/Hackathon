'use client';

import React from 'react';
import ErrorContent from '../src/components/ui/ErrorContent';

export default function RootGlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body className="bg-[#182a4a] m-0 p-0">
        <ErrorContent reset={reset} />
      </body>
    </html>
  );
}
