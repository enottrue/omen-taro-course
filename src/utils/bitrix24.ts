interface Bitrix24Contact {
  NAME: string;
  LAST_NAME: string;
  PHONE: Array<{ VALUE: string; VALUE_TYPE: string }>;
  EMAIL: Array<{ VALUE: string; VALUE_TYPE: string }>;
  ASSIGNED_BY_ID: number;
}

interface Bitrix24Deal {
  TITLE: string;
  NAME: string;
  PHONE: Array<{ VALUE: string; VALUE_TYPE: string }>;
  EMAIL: Array<{ VALUE: string; VALUE_TYPE: string }>;
  COMMENTS: string;
  STATUS_ID: string;
  ASSIGNED_BY_ID: number;
  CATEGORY_ID: number;
  CONTACT_ID: number;
  STAGE_ID: string;
  SOURCE_ID: string;
  CURRENCY_ID?: string;
  UTM_CAMPAIGN?: string;
  UTM_SOURCE?: string;
  UTM_MEDIUM?: string;
  UTM_CONTENT?: string;
  UTM_TERM?: string;
  UF_CRM_1713255453?: string; // dop_contact
  UF_CRM_1705320112?: string; // source_inc
  UF_CRM_1716282476151?: string; // telegram
}

interface Bitrix24Product {
  id: number;
  rows: Array<{
    PRODUCT_ID: string;
    QUANTITY: number;
    PRICE: number;
  }>;
}

interface UtmData {
  UTM_CAMPAIGN?: string;
  UTM_SOURCE?: string;
  UTM_MEDIUM?: string;
  UTM_CONTENT?: string;
  UTM_TERM?: string;
}

const BITRIX24_WEBHOOK_URL = process.env.BITRIX24_WEBHOOK_URL || 'https://crm.taroirena.com/rest/49468/d9cuna1b89mnipbq/';
const BITRIX24_ASSIGNED_BY_ID = parseInt(process.env.BITRIX24_ASSIGNED_BY_ID || '30902');
const BITRIX24_CATEGORY_ID = parseInt(process.env.BITRIX24_CATEGORY_ID || '16');

// Функция для выполнения cURL запросов к Битрикс24
async function makeBitrix24Request(endpoint: string, data: any): Promise<any> {
  const url = `${BITRIX24_WEBHOOK_URL}${endpoint}`;
  
  try {
    console.log('Bitrix24 request URL:', url);
    console.log('Bitrix24 request data:', data);
    
    // Преобразуем данные в URL-encoded формат
    const urlParams = new URLSearchParams();
    
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Для массивов отправляем как JSON
        urlParams.append(key, JSON.stringify(value));
      } else if (typeof value === 'object' && value !== null) {
        // Для объектов отправляем как JSON
        urlParams.append(key, JSON.stringify(value));
      } else {
        // Для простых значений отправляем как есть
        urlParams.append(key, String(value));
      }
    });
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: urlParams,
    });

    console.log('Bitrix24 response status:', response.status);
    console.log('Bitrix24 response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Bitrix24 error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
    }

    const result = await response.json();
    console.log('Bitrix24 success response:', result);
    return result;
  } catch (error) {
    console.error('Bitrix24 request error:', error);
    throw error;
  }
}

// Функция для проверки существования контакта
export async function checkContactExists(phone: string, email: string): Promise<number | null> {
  const contactData = {
    'filter[PHONE]': phone,
    'filter[EMAIL]': email,
    'select[]': 'ID',
  };

  try {
    const response = await makeBitrix24Request('crm.contact.list', contactData);
    return response.result?.[0]?.ID || null;
  } catch (error) {
    console.error('Error checking contact existence:', error);
    return null;
  }
}

// Функция для создания контакта
export async function createContact(contactData: {
  name: string;
  lastName: string;
  phone: string;
  email: string;
}): Promise<number> {
  const bitrixContact: Bitrix24Contact = {
    NAME: contactData.name,
    LAST_NAME: contactData.lastName,
    PHONE: [{ VALUE: contactData.phone, VALUE_TYPE: 'WORK' }],
    EMAIL: [{ VALUE: contactData.email, VALUE_TYPE: 'WORK' }],
    ASSIGNED_BY_ID: BITRIX24_ASSIGNED_BY_ID,
  };

  try {
    // Отправляем данные в формате, который ожидает Битрикс24
    const response = await makeBitrix24Request('crm.contact.add', {
      'fields[NAME]': bitrixContact.NAME,
      'fields[LAST_NAME]': bitrixContact.LAST_NAME,
      'fields[PHONE][0][VALUE]': bitrixContact.PHONE[0].VALUE,
      'fields[PHONE][0][VALUE_TYPE]': bitrixContact.PHONE[0].VALUE_TYPE,
      'fields[EMAIL][0][VALUE]': bitrixContact.EMAIL[0].VALUE,
      'fields[EMAIL][0][VALUE_TYPE]': bitrixContact.EMAIL[0].VALUE_TYPE,
      'fields[ASSIGNED_BY_ID]': bitrixContact.ASSIGNED_BY_ID,
    });

    if (response.result) {
      return response.result;
    } else {
      throw new Error(`Error creating contact: ${response.error_description || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error creating contact:', error);
    throw error;
  }
}

// Функция для получения информации о продукте
export async function getProductInfo(productId: string): Promise<{ name: string; price: number } | null> {
  try {
    const response = await makeBitrix24Request('crm.product.get', {
      id: productId,
    });

    if (response.result?.ID) {
      return {
        name: response.result.NAME,
        price: response.result.PRICE,
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting product info:', error);
    return null;
  }
}

// Функция для создания сделки
export async function createDeal(dealData: {
  title: string;
  name: string;
  phone: string;
  email: string;
  comments: string;
  contactId: number;
  utmData?: UtmData;
  dopContact?: string;
  sourceInc?: string;
  telegram?: string;
  term?: string;
}): Promise<number> {
  const bitrixDeal: Bitrix24Deal = {
    TITLE: dealData.title,
    NAME: dealData.name,
    PHONE: [{ VALUE: dealData.phone, VALUE_TYPE: 'WORK' }],
    EMAIL: [{ VALUE: dealData.email, VALUE_TYPE: 'WORK' }],
    COMMENTS: dealData.comments,
    STATUS_ID: 'NEW',
    ASSIGNED_BY_ID: BITRIX24_ASSIGNED_BY_ID,
    CATEGORY_ID: BITRIX24_CATEGORY_ID,
    CONTACT_ID: dealData.contactId,
    STAGE_ID: 'NEW',
    SOURCE_ID: 'REPEAT_SALE',
    UTM_TERM: dealData.term || 'без тарифа',
    CURRENCY_ID: 'USD', // Устанавливаем валюту в доллары
  };

  // Добавляем UTM метки если они есть
  if (dealData.utmData) {
    if (dealData.utmData.UTM_CAMPAIGN) bitrixDeal.UTM_CAMPAIGN = dealData.utmData.UTM_CAMPAIGN;
    if (dealData.utmData.UTM_SOURCE) bitrixDeal.UTM_SOURCE = dealData.utmData.UTM_SOURCE;
    if (dealData.utmData.UTM_MEDIUM) bitrixDeal.UTM_MEDIUM = dealData.utmData.UTM_MEDIUM;
    if (dealData.utmData.UTM_CONTENT) bitrixDeal.UTM_CONTENT = dealData.utmData.UTM_CONTENT;
  }

  // Добавляем дополнительные поля
  if (dealData.dopContact) bitrixDeal.UF_CRM_1713255453 = dealData.dopContact;
  if (dealData.sourceInc) bitrixDeal.UF_CRM_1705320112 = dealData.sourceInc;
  if (dealData.telegram) bitrixDeal.UF_CRM_1716282476151 = dealData.telegram;

  try {
    // Отправляем данные в формате, который ожидает Битрикс24
    const dealData: any = {
      'fields[TITLE]': bitrixDeal.TITLE,
      'fields[NAME]': bitrixDeal.NAME,
      'fields[PHONE][0][VALUE]': bitrixDeal.PHONE[0].VALUE,
      'fields[PHONE][0][VALUE_TYPE]': bitrixDeal.PHONE[0].VALUE_TYPE,
      'fields[EMAIL][0][VALUE]': bitrixDeal.EMAIL[0].VALUE,
      'fields[EMAIL][0][VALUE_TYPE]': bitrixDeal.EMAIL[0].VALUE_TYPE,
      'fields[COMMENTS]': bitrixDeal.COMMENTS,
      'fields[STATUS_ID]': bitrixDeal.STATUS_ID,
      'fields[ASSIGNED_BY_ID]': bitrixDeal.ASSIGNED_BY_ID,
      'fields[CATEGORY_ID]': bitrixDeal.CATEGORY_ID,
      'fields[CONTACT_ID]': bitrixDeal.CONTACT_ID,
      'fields[STAGE_ID]': bitrixDeal.STAGE_ID,
      'fields[SOURCE_ID]': bitrixDeal.SOURCE_ID,
      'fields[UTM_TERM]': bitrixDeal.UTM_TERM,
      'fields[CURRENCY_ID]': bitrixDeal.CURRENCY_ID,
      'params[REGISTER_SONET_EVENT]': 'Y',
    };

    // Добавляем UTM метки если они есть
    if (bitrixDeal.UTM_CAMPAIGN) dealData['fields[UTM_CAMPAIGN]'] = bitrixDeal.UTM_CAMPAIGN;
    if (bitrixDeal.UTM_SOURCE) dealData['fields[UTM_SOURCE]'] = bitrixDeal.UTM_SOURCE;
    if (bitrixDeal.UTM_MEDIUM) dealData['fields[UTM_MEDIUM]'] = bitrixDeal.UTM_MEDIUM;
    if (bitrixDeal.UTM_CONTENT) dealData['fields[UTM_CONTENT]'] = bitrixDeal.UTM_CONTENT;

    // Добавляем дополнительные поля
    if (bitrixDeal.UF_CRM_1713255453) dealData['fields[UF_CRM_1713255453]'] = bitrixDeal.UF_CRM_1713255453;
    if (bitrixDeal.UF_CRM_1705320112) dealData['fields[UF_CRM_1705320112]'] = bitrixDeal.UF_CRM_1705320112;
    if (bitrixDeal.UF_CRM_1716282476151) dealData['fields[UF_CRM_1716282476151]'] = bitrixDeal.UF_CRM_1716282476151;

    const response = await makeBitrix24Request('crm.deal.add', dealData);

    if (response.result) {
      return response.result;
    } else {
      throw new Error(`Error creating deal: ${response.error_description || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error creating deal:', error);
    throw error;
  }
}

// Функция для добавления товаров к сделке
export async function addProductsToDeal(dealId: number, productId: string, price: number): Promise<boolean> {
  try {
    // Отправляем данные в формате, который ожидает Битрикс24
    const response = await makeBitrix24Request('crm.deal.productrows.set', {
      id: dealId.toString(),
      'rows[0][PRODUCT_ID]': productId,
      'rows[0][QUANTITY]': '1',
      'rows[0][PRICE]': price.toString(),
      'rows[0][CURRENCY_ID]': 'USD', // Устанавливаем валюту в доллары
    });

    return !!response.result;
  } catch (error) {
    console.error('Error adding products to deal:', error);
    return false;
  }
}

// Основная функция для создания сделки при регистрации
export async function createDealOnRegistration(userData: {
  name: string;
  email: string;
  phone: string;
  city?: string;
  productId?: string;
  comments?: string;
  utmData?: UtmData;
  dopContact?: string;
  sourceInc?: string;
  telegram?: string;
  term?: string;
}): Promise<{
  success: boolean;
  dealId?: number;
  contactId?: number;
  productName?: string;
  productPrice?: number;
  error?: string;
}> {
  console.log('🚀 Начинаем создание сделки в Битрикс24...');
  console.log('📋 Данные пользователя:', userData);
  console.log('🔧 Конфигурация Битрикс24:', {
    webhookUrl: BITRIX24_WEBHOOK_URL,
    assignedById: BITRIX24_ASSIGNED_BY_ID,
    categoryId: BITRIX24_CATEGORY_ID
  });
  try {
    // Проверяем существование контакта
    const existingContactId = await checkContactExists(userData.phone, userData.email);
    let contactId: number;

    if (existingContactId) {
      contactId = existingContactId;
      console.log('Контакт найден:', existingContactId);
    } else {
      // Создаем новый контакт
      const nameParts = userData.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      contactId = await createContact({
        name: firstName,
        lastName: lastName,
        phone: userData.phone,
        email: userData.email,
      });
      console.log('Создан новый контакт:', contactId);
    }

    // Получаем информацию о продукте если указан
    let productName: string | undefined;
    let productPrice: number | undefined;

    if (userData.productId) {
      const productInfo = await getProductInfo(userData.productId);
      if (productInfo) {
        productName = productInfo.name;
        productPrice = productInfo.price;
      }
    }

    // Создаем сделку
    const dealId = await createDeal({
      title: `Регистрация пользователя ${userData.name}`,
      name: userData.name,
      phone: userData.phone,
      email: userData.email,
      comments: userData.comments || `Регистрация пользователя ${userData.name} из города ${userData.city || 'не указан'}`,
      contactId,
      utmData: userData.utmData,
      dopContact: userData.dopContact,
      sourceInc: userData.sourceInc,
      telegram: userData.telegram,
      term: userData.term,
    });

    // Добавляем товар к сделке если указан
    if (userData.productId && productPrice) {
      await addProductsToDeal(dealId, userData.productId, productPrice);
    }

    return {
      success: true,
      dealId,
      contactId,
      productName,
      productPrice,
    };
  } catch (error) {
    console.error('Error creating deal on registration:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Функция для получения UTM меток из cookies
export function getUtmDataFromCookies(): UtmData {
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

  return {
    UTM_CAMPAIGN: cookies['utm_campaign'],
    UTM_SOURCE: cookies['utm_source'],
    UTM_MEDIUM: cookies['utm_medium'],
    UTM_CONTENT: cookies['utm_content'],
    UTM_TERM: cookies['utm_term'],
  };
} 