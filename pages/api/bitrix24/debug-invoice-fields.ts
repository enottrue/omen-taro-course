import { NextApiRequest, NextApiResponse } from 'next';

// Конфигурация
const WEBHOOK_URL = 'https://crm.taroirena.com/rest/1/62s3v3dkougs3qsm/';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('🔍 API endpoint для отладки полей счета вызван:', req.url);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { dealId = 12345 } = req.body;
    
    console.log('📋 Deal ID для тестирования:', dealId);

    // 1. Получаем информацию о смарт-процессе
    console.log('🔍 Получаем информацию о смарт-процессе...');
    
    const entityTypeResponse = await fetch(`${WEBHOOK_URL}crm.type.get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ entityTypeId: '31' })
    });

    const entityTypeResult = await entityTypeResponse.json();
    console.log('📋 Информация о смарт-процессе:', entityTypeResult);

    // 2. Получаем поля смарт-процесса
    console.log('🔍 Получаем поля смарт-процесса...');
    
    const fieldsResponse = await fetch(`${WEBHOOK_URL}crm.item.fields`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ entityTypeId: '31' })
    });

    const fieldsResult = await fieldsResponse.json();
    console.log('📋 Поля смарт-процесса:', fieldsResult);

    // 3. Создаем тестовый счет с подробным логированием
    console.log('🔍 Создаем тестовый счет для проверки полей...');
    
    const testInvoiceData = {
      'entityTypeId': '31',
      'fields[title]': `Test Invoice - Debug Fields`,
      'fields[stageId]': 'NEW',
      'fields[assignedById]': '1',
      'fields[contactId]': '1',
      'fields[opportunity]': '50',
      'fields[currencyId]': 'USD',
      'fields[parentId2]': dealId.toString(),
      'fields[mycompanyId]': '51',
      'fields[sourceId]': 'UC_HZ10CI',
      'fields[ufCrm_SMART_INVOICE_1706948587230]': '1013',
      'fields[COMMENTS]': `Test invoice for debugging UF field`
    };
    
    console.log('📋 Тестовые данные для создания счета:', testInvoiceData);

    const createResponse = await fetch(`${WEBHOOK_URL}crm.item.add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(testInvoiceData)
    });

    const createResult = await createResponse.json();
    console.log('📋 Результат создания тестового счета:', createResult);

    // 4. Если счет создан, получаем его данные для проверки полей
    let invoiceData = null;
    if (createResult.result && createResult.result.item && createResult.result.item.id) {
      const invoiceId = createResult.result.item.id;
      console.log('🔍 Получаем данные созданного счета:', invoiceId);
      
      const getInvoiceResponse = await fetch(`${WEBHOOK_URL}crm.item.get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          entityTypeId: '31',
          id: invoiceId.toString()
        })
      });

      const getInvoiceResult = await getInvoiceResponse.json();
      console.log('📋 Данные созданного счета:', getInvoiceResult);
      invoiceData = getInvoiceResult;
    }

    // 5. Проверяем конкретное поле UF_CRM_1628621924030
    console.log('🔍 Проверяем поле UF_CRM_1628621924030...');
    
    // Ищем это поле в списке доступных полей
    const ufField = fieldsResult.result?.fields?.UF_CRM_1628621924030;
    console.log('📋 Информация о поле UF_CRM_1628621924030:', ufField);

    res.status(200).json({ 
      success: true,
      entityType: entityTypeResult,
      fields: fieldsResult,
      createResult: createResult,
      invoiceData: invoiceData,
      ufFieldInfo: ufField,
      message: 'Debug information retrieved successfully'
    });
  } catch (error) {
    console.error('❌ Error debugging invoice fields:', error);
    res.status(500).json({ error: 'Error debugging invoice fields' });
  }
} 