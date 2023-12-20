import { useQuery } from '@apollo/client';
import { GET_USER } from '../graphql/queries';

// Define the custom hook
const useGetUserData = (userId: number) => {
  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id: userId },
    skip: !userId,
  });

  console.log(777, data);

  return {
    loading,
    error,
    user: data?.getUser,
  };
};

export default useGetUserData;
