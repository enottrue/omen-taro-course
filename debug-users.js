const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugUsers() {
  try {
    console.log('🔍 Детальная проверка всех пользователей...\n');

    // Получаем ВСЕХ пользователей
    const allUsers = await prisma.user.findMany({
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
      orderBy: {
        id: 'asc',
      },
    });

    console.log(`📋 Всего пользователей в базе: ${allUsers.length}\n`);

    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. 👤 Пользователь ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Имя: ${user.name}`);
      console.log(`   isPaid: ${user.isPaid} ${user.isPaid ? '✅' : '❌'}`);
      console.log(`   Дата оплаты: ${user.paymentDate || 'Не указана'}`);
      console.log(`   Stripe Session: ${user.stripeSessionId || 'Не указан'}`);
      console.log(`   Онбординг: ${user.onboarded ? '✅' : '❌'}`);
      console.log(`   Создан: ${user.createdAt.toLocaleString()}`);
      console.log(`   Обновлен: ${user.updatedAt.toLocaleString()}`);
      console.log('');
    });

    // Подсчитываем статистику
    const paidUsers = allUsers.filter(u => u.isPaid === true);
    const unpaidUsers = allUsers.filter(u => u.isPaid === false);

    console.log('📊 Статистика:');
    console.log(`   - Всего пользователей: ${allUsers.length}`);
    console.log(`   - Оплаченных (isPaid: true): ${paidUsers.length}`);
    console.log(`   - Не оплаченных (isPaid: false): ${unpaidUsers.length}`);

    if (paidUsers.length > 0) {
      console.log('\n💰 Оплаченные пользователи:');
      paidUsers.forEach(user => {
        console.log(`   - ${user.email} (ID: ${user.id})`);
      });
    }

    if (unpaidUsers.length > 0) {
      console.log('\n🔒 Не оплаченные пользователи:');
      unpaidUsers.forEach(user => {
        console.log(`   - ${user.email} (ID: ${user.id})`);
      });
    }

  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugUsers(); 