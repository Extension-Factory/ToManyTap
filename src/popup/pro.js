// Pro 버전 관련 저장소 함수들

export async function getUser() {
  const { user = { tier: 'free', proUntil: null } } = await chrome.storage.local.get('user');
  return user;
}

export async function setUser(user) {
  await chrome.storage.local.set({ user });
}

export async function isPro() {
  const user = await getUser();
  if (user.tier === 'pro' && user.proUntil) {
    // Pro가 만료되었는지 확인
    if (Date.now() < user.proUntil) {
      return true;
    } else {
      // Pro 만료됨
      await setUser({ tier: 'free', proUntil: null });
      return false;
    }
  }
  return false;
}

export async function upgradeToProTest(durationDays = 30) {
  // 테스트용: 현재로부터 durationDays 동안 Pro 활성화
  const proUntil = Date.now() + (durationDays * 24 * 60 * 60 * 1000);
  await setUser({ tier: 'pro', proUntil });
  return { success: true, proUntil };
}

export async function downgradeToFree() {
  await setUser({ tier: 'free', proUntil: null });
}

export async function getProRemainingDays() {
  const user = await getUser();
  if (user.tier === 'pro' && user.proUntil) {
    const remainingMs = user.proUntil - Date.now();
    if (remainingMs > 0) {
      return Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
    }
  }
  return 0;
}

export async function canCreateSession() {
  const user = await getUser();
  if (user.tier === 'pro') {
    return { allowed: true };
  }
  
  // Free 버전: 최대 5개 세션
  const { sessions = [] } = await chrome.storage.local.get('sessions');
  if (sessions.length >= 5) {
    return {
      allowed: false,
      reason: 'free_limit_reached',
      message: 'Free 버전은 최대 5개 세션만 저장 가능합니다.',
      limit: 5,
      current: sessions.length
    };
  }
  
  return { allowed: true };
}

export async function getStats() {
  const user = await getUser();
  const { sessions = [] } = await chrome.storage.local.get('sessions');
  const remainingDays = await getProRemainingDays();
  
  return {
    tier: user.tier,
    sessionCount: sessions.length,
    sessionLimit: user.tier === 'pro' ? 'unlimited' : 5,
    isPro: await isPro(),
    proRemainingDays: remainingDays,
  };
}
