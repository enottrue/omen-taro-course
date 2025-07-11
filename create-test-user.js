const fetch = require('node-fetch');

async function createTestUser() {
  try {
    console.log('🧪 Создание тестового пользователя через API...\n');

    // 1. Создаем пользователя через GraphQL API
    console.log('1️⃣ Регистрация пользователя test@gmail.com...');
    
    const registerQuery = `
      mutation RegisterUser($email: String!, $name: String!, $password: String!, $city: String, $phone: String) {
        registerUser(email: $email, name: $name, password: $password, city: $city, phone: $phone) {
          token
          user {
            id
            email
            name
            city
            phone
            isPaid
            onboarded
            bitrix24ContactId
            bitrix24DealId
          }
          message
          error
        }
      }
    `;

    const registerResponse = await fetch('http://localhost:3000/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: registerQuery,
        variables: {
          name: 'Test User',
          email: 'test@gmail.com',
          password: 'testpassword123',
          phone: '+7 (999) 123-45-67',
          city: 'Москва'
        }
      }),
    });

    const registerResult = await registerResponse.json();
    
    if (registerResult.data?.registerUser?.error === false) {
      console.log('✅ Пользователь успешно зарегистрирован:');
      console.log(`   - ID: ${registerResult.data.registerUser.user.id}`);
      console.log(`   - Email: ${registerResult.data.registerUser.user.email}`);
      console.log(`   - Статус оплаты: ${registerResult.data.registerUser.user.isPaid ? '💳 Оплачен' : '🔒 Не оплачен'}`);
      console.log(`   - Онбординг: ${registerResult.data.registerUser.user.onboarded ? '✅ Пройден' : '❌ Не пройден'}`);
    } else {
      console.log('ℹ️ Пользователь уже существует или ошибка регистрации:', registerResult.data?.registerUser?.message);
    }

    // 2. Получаем информацию о пользователе
    console.log('\n2️⃣ Получение информации о пользователе...');
    
    const getUserQuery = `
      query GetUser($id: ID!) {
        getUser(id: $id) {
          id
          email
          name
          city
          phone
          isPaid
          onboarded
          bitrix24ContactId
          bitrix24DealId
        }
      }
    `;

    const userResponse = await fetch('http://localhost:3000/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: getUserQuery,
        variables: {
          id: '6' // ID пользователя test@gmail.com
        }
      }),
    });

    const userResult = await userResponse.json();
    
    if (userResult.data?.getUser) {
      console.log('✅ Информация о пользователе:');
      console.log(`   - ID: ${userResult.data.getUser.id}`);
      console.log(`   - Email: ${userResult.data.getUser.email}`);
      console.log(`   - Имя: ${userResult.data.getUser.name}`);
      console.log(`   - Статус оплаты: ${userResult.data.getUser.isPaid ? '💳 Оплачен' : '🔒 Не оплачен'}`);
      console.log(`   - Онбординг: ${userResult.data.getUser.onboarded ? '✅ Пройден' : '❌ Не пройден'}`);
    }

    // 3. Обновляем статус оплаты через API
    console.log('\n3️⃣ Обновление статуса оплаты...');
    
    const updateResponse = await fetch('http://localhost:3000/api/users/update-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: 6, // ID пользователя test@gmail.com
        isPaid: true
      }),
    });

    const updateResult = await updateResponse.json();
    
    if (updateResult.success) {
      console.log('✅ Статус оплаты обновлен:');
      console.log(`   - ID: ${updateResult.user.id}`);
      console.log(`   - Email: ${updateResult.user.email}`);
      console.log(`   - Новый статус: ${updateResult.user.isPaid ? '💳 Оплачен' : '🔒 Не оплачен'}`);
    } else {
      console.log('❌ Ошибка обновления статуса:', updateResult.error);
    }

    console.log('\n🎉 Тестирование завершено!');
    console.log('\n📋 Для проверки:');
    console.log('   - Перейдите на http://localhost:3000/payment-test');
    console.log('   - Войдите как test@gmail.com');
    console.log('   - Проверьте доступ к /courses, /course_book, /lesson/1/1');

  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

createTestUser(); 