// URL-константы для поиска и навигации

// Поиск по умолчанию — Yahoo!
export const DEFAULT_SEARCH_ENGINE = 'https://search.yahoo.com/search?p={query}';

export const HOME_URL = 'about:blank';
export const NEW_TAB_URL = 'about:newtab';

// Формирование поисковой ссылки
export function buildSearchUrl(query: string): string {
  return DEFAULT_SEARCH_ENGINE.replace('{query}', encodeURIComponent(query));
}

// Проверка: является ли строка URL или поисковым запросом
export function isUrl(input: string): boolean {
  try {
    const url = new URL(input);
    return url.protocol === 'http:' || url.protocol === 'https:' || url.protocol === 'file:';
  } catch {
    // Если содержит точку и нет пробелов — скорее всего URL
    return /^[\w-]+(\.[\w-]+)+/.test(input) && !input.includes(' ');
  }
}

// Нормализация URL (добавление https:// при необходимости)
export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (isUrl(trimmed)) {
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('file://')) {
      return `https://${trimmed}`;
    }
    return trimmed;
  }
  return buildSearchUrl(trimmed);
}
