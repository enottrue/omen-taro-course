// Функция для получения UTM меток из URL параметров
export function getUtmFromUrl(): Record<string, string> {
  if (typeof window === 'undefined') {
    return {};
  }

  const urlParams = new URLSearchParams(window.location.search);
  const utmParams: Record<string, string> = {};

  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  
  utmKeys.forEach(key => {
    const value = urlParams.get(key);
    if (value) {
      utmParams[key] = value;
    }
  });

  return utmParams;
}

// Функция для сохранения UTM меток в cookies
export function saveUtmToCookies(utmData: Record<string, string>): void {
  if (typeof document === 'undefined') {
    return;
  }

  Object.entries(utmData).forEach(([key, value]) => {
    // Устанавливаем cookie на 30 дней
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    
    document.cookie = `${key}=${value}; expires=${expires.toUTCString()}; path=/`;
  });
}

// Функция для получения UTM меток из cookies
export function getUtmFromCookies(): Record<string, string> {
  if (typeof document === 'undefined') {
    return {};
  }

  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    if (key && value) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, string>);

  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const utmData: Record<string, string> = {};

  utmKeys.forEach(key => {
    if (cookies[key]) {
      utmData[key] = cookies[key];
    }
  });

  return utmData;
}

// Функция для инициализации UTM меток
export function initializeUtm(): void {
  if (typeof window === 'undefined') {
    return;
  }

  // Получаем UTM из URL
  const urlUtm = getUtmFromUrl();
  
  // Если есть UTM в URL, сохраняем их в cookies
  if (Object.keys(urlUtm).length > 0) {
    saveUtmToCookies(urlUtm);
  }
}

// Функция для получения UTM меток в формате для Битрикс24
export function getUtmForBitrix24(): {
  UTM_CAMPAIGN?: string;
  UTM_SOURCE?: string;
  UTM_MEDIUM?: string;
  UTM_CONTENT?: string;
  UTM_TERM?: string;
} {
  const utmData = getUtmFromCookies();
  
  return {
    UTM_CAMPAIGN: utmData.utm_campaign,
    UTM_SOURCE: utmData.utm_source,
    UTM_MEDIUM: utmData.utm_medium,
    UTM_CONTENT: utmData.utm_content,
    UTM_TERM: utmData.utm_term,
  };
} 