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
      const utmData = getUtmForBitrix24();
      console.log('📊 UTM данные для регистрации:', utmData);
      
      const submitDataReturn: any = await createUserMutation({
        variables: {
          name: formData?.name,
          email: formData?.email?.toLowerCase(),
          phone: formData?.phone,
          password: formData?.password,
          city: formData?.city,
          utmData: Object.keys(utmData).length > 0 ? utmData : undefined,
        },
      });

      const result = submitDataReturn?.data?.registerUser;
      console.log('📋 Результат регистрации:', result);

      // Сделка создается автоматически в GraphQL резолвере registerUser
      if (result && !result.error) {
        console.log('✅ Пользователь успешно зарегистрирован:', result.user?.id);
        if (result.user?.bitrix24DealId) {
          console.log('✅ Сделка создана в Битрикс24:', result.user.bitrix24DealId);
        } else {
          console.log('⚠️ Сделка НЕ создана в Битрикс24');
        }
      } else if (result?.error === 'true') {
        console.log('❌ Ошибка регистрации:', result?.message);
      } else {
        console.log('✅ Регистрация прошла успешно');
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
