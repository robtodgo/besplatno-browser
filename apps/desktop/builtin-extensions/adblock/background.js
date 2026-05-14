console.log('Besplatno AdBlock инициализирован');

chrome.runtime.onInstalled.addListener(() => {
  console.log('Блокировщик рекламы установлен и готов к работе');
});
