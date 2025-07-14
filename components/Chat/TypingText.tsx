'use client';
import React, { useEffect, useState } from 'react';

type Props = {
  text?: string;
  speed?: number;
  trigger: any;
};

export default function TypingText({ text = 'Writing..', speed = 100, trigger }: Props) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i > text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [trigger]);

  return <span className="text-xs text-blue-300">{displayed}</span>;
}