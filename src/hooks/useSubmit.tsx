import { useMutation, gql, ApolloError } from '@apollo/client';
import { useState } from 'react';
import {
  GET_USER,
  GET_USERS,
  ADD_USER,
  REGISTER_USER,
  ADD_STAGE_STATUS,
} from '../graphql/queries';
import { getUtmForBitrix24 } from '../utils/utmUtils';

export const useSubmit = (formData: any) => {
  const [createUserMutation, { loading, error }] = useMutation(REGISTER_USER, {
    errorPolicy: 'all',
  });
  const [addStageStatusMutation] = useMutation(ADD_STAGE_STATUS);

  const [errorSubmit, setErrorSubmit] = useState('');

  const handleSubmit = async (formData: any) => {
    // Check if the required fields are present
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.city
    ) {
      throw new Error('Все поля обязательны для заполнения');
    }

    try {
      // Call the GraphQL mutation to create a user
      const submitDataReturn: any = await createUserMutation({
        variables: {
          name: formData?.name,
          email: formData?.email?.toLowerCase(),
          phone: formData?.phone,
          password: formData?.password,
          city: formData?.city,
        },
      });

      const result = submitDataReturn?.data?.registerUser;

      // Если регистрация прошла успешно, создаем сделку в Битрикс24
      if (result && !result.error) {
        try {
          const utmData = getUtmForBitrix24();
          
          // Вызываем API endpoint для создания сделки
          const bitrixResponse = await fetch('/api/bitrix24/create-deal', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email.toLowerCase(),
              phone: formData.phone,
              city: formData.city,
              productId: '1777', // Добавляем товар 1777
              utmData,
              comments: `Регистрация пользователя ${formData.name} из города ${formData.city}`,
            }),
          });

          if (bitrixResponse.ok) {
            const bitrixResult = await bitrixResponse.json();
            console.log('Сделка успешно создана в Битрикс24:', bitrixResult);
            
            // Здесь можно добавить обновление пользователя с ID из Битрикс24
            // если нужно сохранить в базе данных
            if (bitrixResult.success && result?.user?.id) {
              console.log('ID контакта в Битрикс24:', bitrixResult.contactId);
              console.log('ID сделки в Битрикс24:', bitrixResult.dealId);
            }
          } else {
            console.error('Ошибка создания сделки в Битрикс24');
          }
        } catch (bitrixError) {
          console.error('Ошибка интеграции с Битрикс24:', bitrixError);
          // Не прерываем регистрацию пользователя, если Битрикс24 недоступен
        }
      }

      return result;

      // Handle the response data here
    } catch (error) {
      if (error instanceof ApolloError) {
        setErrorSubmit(error.message);
        console.log('error23', error);
      }
    }
  };
  return { handleSubmit, loading, errorSubmit: error };
};

export default useSubmit;
