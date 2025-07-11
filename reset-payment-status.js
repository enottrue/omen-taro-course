const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetPaymentStatus() {
  try {
    console.log('🔄 Сброс статуса оплаты всех пользователей...\n');

    // Сбрасываем статус оплаты для всех пользователей
    const result = await prisma.user.updateMany({
      where: {
        isPaid: true,
      },
      data: {
        isPaid: false,
        paymentDate: null,
        stripeSessionId: null,
      },
    });

    console.log(`✅ Сброшен статус оплаты для ${result.count} пользователей`);

    // Проверяем результат
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        isPaid: true,
        paymentDate: true,
        stripeSessionId: true,
      },
    });

    console.log('\n📋 Текущий статус всех пользователей:');
    users.forEach(user => {
      console.log(`   - ID: ${user.id}, Email: ${user.email}, Оплачен: ${user.isPaid ? '✅' : '❌'}`);
    });

  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetPaymentStatus(); 