import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../src/lib/prisma/prismaClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, isPaid } = req.body;

    // Валидация обязательных полей
    if (!userId || typeof isPaid !== 'boolean') {
      return res.status(400).json({
        error: 'Missing required fields: userId, isPaid',
      });
    }

    // Обновляем статус оплаты пользователя
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { isPaid },
    });

    return res.status(200).json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        isPaid: updatedUser.isPaid,
        bitrix24ContactId: updatedUser.bitrix24ContactId,
        bitrix24DealId: updatedUser.bitrix24DealId,
      },
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
} 