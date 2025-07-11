const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetAllPayments() {
  try {
    console.log('🔄 Сброс оплаты у ВСЕХ пользователей...\n');

    // Сбрасываем статус оплаты для ВСЕХ пользователей
    const result = await prisma.user.updateMany({
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
      orderBy: {
        id: 'asc',
      },
    });

    console.log('\n📋 Текущий статус всех пользователей:');
    users.forEach(user => {
      console.log(`   - ID: ${user.id}, Email: ${user.email}, Оплачен: ${user.isPaid ? '✅' : '❌'}`);
    });

    // Подсчитываем статистику
    const paidUsers = users.filter(u => u.isPaid === true);
    const unpaidUsers = users.filter(u => u.isPaid === false);

    console.log('\n📊 Статистика после сброса:');
    console.log(`   - Всего пользователей: ${users.length}`);
    console.log(`   - Оплаченных: ${paidUsers.length}`);
    console.log(`   - Не оплаченных: ${unpaidUsers.length}`);

    if (paidUsers.length === 0) {
      console.log('\n✅ Отлично! Все пользователи теперь не оплачены');
    } else {
      console.log('\n⚠️ Внимание! Некоторые пользователи все еще отмечены как оплаченные');
    }

  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAllPayments(); 