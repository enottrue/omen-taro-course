import { NextApiRequest, NextApiResponse } from 'next';
import { createDealOnRegistration } from '../../../src/utils/bitrix24';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: 'Missing required field: userId',
      });
    }

    // Получаем данные пользователя из базы
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    // Проверяем, не создана ли уже сделка
    if (user.bitrix24DealId) {
      return res.status(200).json({
        success: true,
        dealId: user.bitrix24DealId,
        contactId: user.bitrix24ContactId,
        message: 'Deal already exists',
      });
    }

    // Создаем сделку в Битрикс24
    const result = await createDealOnRegistration({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      city: user.city || undefined,
      productId: '1777',
      comments: `Регистрация пользователя ${user.name}`,
      utmData: undefined, // UTM данные уже не доступны на этом этапе
    });

    if (result.success) {
      // Обновляем пользователя с ID из Битрикс24
      await prisma.user.update({
        where: { id: user.id },
        data: {
          bitrix24ContactId: result.contactId,
          bitrix24DealId: result.dealId,
        },
      });

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
    console.error('Error creating deal asynchronously:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
