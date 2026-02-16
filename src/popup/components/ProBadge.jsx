import React, { useState, useEffect } from 'react';
import { isPro, upgradeToProTest, downgradeToFree, getProRemainingDays } from '../pro';

function ProBadge() {
  const [isPROUser, setIsPRO] = useState(false);
  const [remainingDays, setRemainingDays] = useState(0);

  useEffect(() => {
    checkProStatus();
  }, []);

  async function checkProStatus() {
    const pro = await isPro();
    setIsPRO(pro);
    if (pro) {
      const days = await getProRemainingDays();
      setRemainingDays(days);
    }
  }

  if (!isPROUser) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1 rounded text-sm font-bold text-white">
      👑 PRO ({remainingDays}일 남음)
    </div>
  );
}

export default ProBadge;
