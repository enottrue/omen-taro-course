import { NextApiRequest, NextApiResponse } from 'next';
import { testBitrix24Connection, createInvoice } from '../../../src/utils/bitrix24';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔍 Testing Bitrix24 connection...');
    
    // Тестируем подключение
    const connectionTest = await testBitrix24Connection();
    
    if (!connectionTest.success) {
      return res.status(500).json({
        error: 'Bitrix24 connection failed',
        details: connectionTest
      });
    }
    
    // Если есть dealId в query параметрах, тестируем создание счета
    const { dealId, amount = 50, currency = 'USD' } = req.query;
    
    if (dealId) {
      console.log('💰 Testing invoice creation...');
      const invoiceTest = await createInvoice(
        parseInt(dealId as string), 
        parseFloat(amount as string), 
        currency as string
      );
      
      return res.status(200).json({
        connection: connectionTest,
        invoiceTest
      });
    }
    
    return res.status(200).json({
      connection: connectionTest,
      message: 'Add ?dealId=123&amount=50&currency=USD to test invoice creation'
    });
    
  } catch (error) {
    console.error('❌ Error testing Bitrix24:', error);
    res.status(500).json({ 
      error: 'Error testing Bitrix24 connection',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 