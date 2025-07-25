import { useMutation } from '@apollo/client';
import { setOnboardingStatus } from '@/utils/onboardingUtils';
import { LOGIN_USER } from '@/graphql/queries';

export const useLoginUser = () => {
  const [loginUser, { data, loading, error }] = useMutation(LOGIN_USER);

  const login = async (email: String, password: String) => {
    const em = email.toLowerCase();
    try {
      const response = await loginUser({ variables: { email: em, password } });

      if (response.data?.loginUser?.user?.onboarded) {
        setOnboardingStatus('true');
      }

      return {
        user: response?.data?.loginUser?.user, //?.loginUser.user,
        error: response?.data?.loginUser?.error,
        message: response?.data?.loginUser?.message,
        token: response?.data?.loginUser?.token,
      };
      return response.data.loginUser;
    } catch (err) {
      throw err;
      //   return {
      //     message: (err as Error).message,
      //     error: true,
      //   };
    }
  };

  return {
    login,
    loading,
    error,
  };
};

export default useLoginUser;
