const fetch = require('node-fetch');

async function testRegistration() {
  console.log('🧪 Тестирование процесса регистрации...\n');

  try {
    // Тест 1: Проверка API endpoint для создания сделки
    console.log('1️⃣ Тестирование API endpoint /api/bitrix24/create-deal...');
    
    const testData = {
      name: 'Тестовый Пользователь Регистрации',
      email: 'test.registration@example.com',
      phone: '+7 (999) 987-65-43',
      city: 'Санкт-Петербург',
      productId: '1777',
      comments: 'Тестовая регистрация через форму',
      utmData: {
        UTM_SOURCE: 'test_registration',
        UTM_MEDIUM: 'form',
        UTM_CAMPAIGN: 'registration_test'
      }
    };

    const response = await fetch('http://localhost:3000/api/bitrix24/create-deal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();
    
    if (result.success) {
      // console.log('✅ Сделка успешно создана в Битрикс24:');
      // console.log(`   - ID сделки: ${result.dealId}`);
      // console.log(`   - ID контакта: ${result.contactId}`);
      // console.log(`   - Продукт: ${result.productName}`);
      // console.log(`   - Цена: $${result.productPrice}`);
    } else {
      console.log('❌ Ошибка создания сделки:', result.error);
    }

    console.log('\n2️⃣ Тестирование GraphQL регистрации...');
    
    // Тест 2: Проверка GraphQL регистрации
    const graphqlQuery = `
      mutation RegisterUser($email: String!, $name: String!, $password: String!, $city: String, $phone: String) {
        registerUser(email: $email, name: $name, password: $password, city: $city, phone: $phone) {
          token
          user {
            id
            email
            name
            city
            phone
            bitrix24ContactId
            bitrix24DealId
          }
          message
          error
        }
      }
    `;

    const graphqlResponse = await fetch('http://localhost:3000/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: graphqlQuery,
        variables: {
          name: 'Тестовый Пользователь GraphQL',
          email: 'test.graphql@example.com',
          password: 'testpassword123',
          phone: '+7 (999) 111-22-33',
          city: 'Новосибирск'
        }
      }),
    });

    const graphqlResult = await graphqlResponse.json();
    
    if (graphqlResult.data?.registerUser?.error === false) {
      console.log('✅ GraphQL регистрация успешна:');
      console.log(`   - ID пользователя: ${graphqlResult.data.registerUser.user.id}`);
      console.log(`   - Email: ${graphqlResult.data.registerUser.user.email}`);
      console.log(`   - ID контакта в Битрикс24: ${graphqlResult.data.registerUser.user.bitrix24ContactId || 'Не создан'}`);
      console.log(`   - ID сделки в Битрикс24: ${graphqlResult.data.registerUser.user.bitrix24DealId || 'Не создана'}`);
    } else {
      console.log('❌ Ошибка GraphQL регистрации:', graphqlResult.data?.registerUser?.message);
    }

    console.log('\n🎉 Тестирование завершено!');
    console.log('\n📋 Инструкции для ручного тестирования:');
    console.log('1. Откройте http://localhost:3000 в браузере');
    console.log('2. Нажмите "Sign In"');
    console.log('3. Выберите регистрацию');
    console.log('4. Заполните форму регистрации');
    console.log('5. Проверьте, что сделка создана в Битрикс24');

  } catch (error) {
    console.error('❌ Ошибка тестирования:', error.message);
  }
}

testRegistration(); 