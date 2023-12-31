import { useMutation } from '@apollo/client';
import { UPDATE_USER } from '@/graphql/queries';

export const useUpdateUserData = () => {
  const [updateUser, { data, loading, error }] = useMutation(UPDATE_USER);

  const update = async ({
    id,
    email,
    password,
    onboarded,
    city,
    name,
    phone,
  }: {
    id: string | number;
    email?: string;
    password?: string;
    onboarded?: boolean;
    city?: string;
    name?: string;
    phone?: string;
  }) => {
    const variables = {
      id,
      email,
      password,
      onboarded,
      city,
      name,
      phone,
    };
    try {
      const response = await updateUser({ variables });
      //   if (response.data?.loginUser?.user?.onboarded) {
      //     console.log('onboarded value is changed');
      //     localStorage.setItem('onboarded', 'true');
      //   }

      return {
        user: response?.data?.updateUser,
        error: response?.data?.updateUser?.error,
        message: response?.data?.updateUser?.message,
      };
    } catch (err) {
      throw err;
      //   return {
      //     message: (err as Error).message,
      //     error: true,
      //   };
    }
  };

  return {
    update,
    loading,
    error,
  };
};

export default useUpdateUserData;
