'use client';
import React, { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    window.location.pathname = '/home';
  }, []);
  return <div>Redirecting to Home page</div>;
}
