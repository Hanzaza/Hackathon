'use client';

import React, { useEffect } from 'react';
import ErrorContent from '../src/components/ui/ErrorContent';

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log interno seguro sin exponer al usuario
    console.error('Unhandled app error captured safely:', error);
  }, [error]);

  return <ErrorContent reset={reset} />;
}
