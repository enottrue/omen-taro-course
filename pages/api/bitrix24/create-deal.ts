import { NextApiRequest, NextApiResponse } from 'next';
import { createDealOnRegistration } from '../../../src/utils/bitrix24';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      name,
      email,
      phone,
      city,
      productId,
      comments,
      utmData,
      dopContact,
      sourceInc,
      telegram,
      term,
    } = req.body;

    // Валидация обязательных полей
    if (!name || !email || !phone) {
      return res.status(400).json({
        error: 'Missing required fields: name, email, phone',
      });
    }

    const result = await createDealOnRegistration({
      name,
      email,
      phone,
      city,
      productId,
      comments,
      utmData,
      dopContact,
      sourceInc,
      telegram,
      term,
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        dealId: result.dealId,
        contactId: result.contactId,
        productName: result.productName,
        productPrice: result.productPrice,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('Error creating deal:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
} 