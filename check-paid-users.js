const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkPaidUsers() {
  try {
    console.log('💰 Проверка пользователей со статусом оплаты...\n');

    // Получаем всех пользователей с isPaid: true
    const paidUsers = await prisma.user.findMany({
      where: {
        isPaid: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        isPaid: true,
        paymentDate: true,
        stripeSessionId: true,
        onboarded: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (paidUsers.length === 0) {
      console.log('❌ Нет пользователей со статусом оплаты');
    } else {
      console.log(`✅ Найдено ${paidUsers.length} пользователей со статусом оплаты:`);
      paidUsers.forEach(user => {
        console.log(`\n   👤 Пользователь:`);
        console.log(`      - ID: ${user.id}`);
        console.log(`      - Email: ${user.email}`);
        console.log(`      - Имя: ${user.name}`);
        console.log(`      - Статус оплаты: ${user.isPaid ? '💳 Оплачен' : '🔒 Не оплачен'}`);
        console.log(`      - Дата оплаты: ${user.paymentDate || 'Не указана'}`);
        console.log(`      - Stripe Session ID: ${user.stripeSessionId || 'Не указан'}`);
        console.log(`      - Онбординг: ${user.onboarded ? '✅ Пройден' : '❌ Не пройден'}`);
        console.log(`      - Создан: ${user.createdAt}`);
        console.log(`      - Обновлен: ${user.updatedAt}`);
      });
    }

    // Также показываем общую статистику
    const allUsers = await prisma.user.findMany({
      select: {
        isPaid: true,
      },
    });

    const paidCount = allUsers.filter(u => u.isPaid).length;
    const totalCount = allUsers.length;

    console.log(`\n📊 Общая статистика:`);
    console.log(`   - Всего пользователей: ${totalCount}`);
    console.log(`   - Оплаченных: ${paidCount}`);
    console.log(`   - Не оплаченных: ${totalCount - paidCount}`);

  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPaidUsers(); 