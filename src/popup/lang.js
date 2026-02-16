// 언어 설정 저장소
const LANG_KEY = 'tomantytab_lang';

export async function getLang() {
  return new Promise((resolve) => {
    chrome.storage.local.get([LANG_KEY], (result) => {
      resolve(result[LANG_KEY] || getBrowserLang());
    });
  });
}

export async function setLang(lang) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [LANG_KEY]: lang }, resolve);
  });
}

// 브라우저 언어 자동 감지
function getBrowserLang() {
  const browserLang = chrome.i18n.getUILanguage().split('-')[0];
  return browserLang === 'ko' ? 'ko' : 'en';
}

// 번역 데이터
export const messages = {
  en: {
    title: 'ToManyTab',
    tabsOpen: 'Tabs Open',
    allClean: 'All clean!',
    stashTabs: 'Stash Tabs & Close',
    sessionName: 'Session name (optional)',
    noSessions: 'No sessions yet',
    startStashing: 'Start stashing tabs to see them here',
    restored: 'tabs restored!',
    deleted: 'Session deleted',
    donate: 'Support Developer',
    donateDesc: 'If ToManyTab helps you, please support the developer with a small donation ☕',
    supportButton: '☕ Support Developer',
    noThanks: 'No Thanks',
    language: 'Language',
    currentlyOpenTabs: 'Currently Open Tabs',
    dragToAddSessions: 'Drag to a session below to add',
    drag: 'Drag',
    restore: 'Restore',
    preview: 'Preview',
    delete: 'Delete',
    tabsInSession: 'Tabs in this session:',
    selectSession: 'Select session:',
    noSessionsAvailable: 'No sessions available',
    noMatchingSessions: 'No matching sessions',
    searchSessions: 'Search sessions...',
    tabAdded: 'Tab added to session!',
    failedAddTab: 'Failed to add tab',
    tabRemoved: 'Tab removed',
    failedRemoveTab: 'Failed to remove tab',
    dropTabsHint: '↓ Drop tabs here to add them',
    sessionRestored: 'Session restored',
    failedRestore: 'Failed to restore session',
  },
  ko: {
    title: 'ToManyTab',
    tabsOpen: '열려있는 탭',
    allClean: '깨끗해요!',
    stashTabs: '탭 저장 & 닫기',
    sessionName: '세션 이름 (선택사항)',
    noSessions: '저장된 세션이 없습니다',
    startStashing: '탭을 저장하면 여기서 볼 수 있습니다',
    restored: '개의 탭이 복원되었습니다!',
    deleted: '세션이 삭제되었습니다',
    donate: '개발자 후원하기',
    donateDesc: 'ToManyTab이 도움이 되었다면, 작은 후원으로 개발자를 응원해주세요 ☕',
    supportButton: '☕ 후원하기',
    noThanks: '괜찮습니다',
    language: '언어',
    currentlyOpenTabs: '현재 열려있는 탭',
    dragToAddSessions: '아래 세션으로 드래그하여 추가하세요',
    drag: '드래그',
    restore: '복원',
    preview: '미리보기',
    delete: '삭제',
    tabsInSession: '이 세션의 탭:',
    selectSession: '세션 선택:',
    noSessionsAvailable: '사용 가능한 세션이 없습니다',
    noMatchingSessions: '일치하는 세션이 없습니다',
    searchSessions: '세션 검색...',
    tabAdded: '탭이 세션에 추가되었습니다!',
    failedAddTab: '탭 추가 실패',
    tabRemoved: '탭이 제거되었습니다',
    failedRemoveTab: '탭 제거 실패',
    dropTabsHint: '↓ 탭을 여기에 드롭하여 추가하세요',
    sessionRestored: '세션이 복원되었습니다',
    failedRestore: '세션 복원 실패',
  },
};

export function t(key, lang) {
  return messages[lang]?.[key] || messages['en'][key] || key;
}
