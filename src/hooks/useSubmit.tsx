import { useMutation, gql } from '@apollo/client';
import {
  GET_USER,
  GET_USERS,
  ADD_USER,
  REGISTER_USER,
} from '../graphql/queries';

export const useSubmit = (formData: any) => {
  const [createUserMutation, { loading, error }] = useMutation(REGISTER_USER);

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
      const data: any = await createUserMutation({
        variables: {
          name: formData?.name,
          email: formData?.email,
          phone: formData?.phone,
          password: formData?.password,
          city: formData?.city,
        },
        // variables: {
        //   //fill all fields with "test"
        //   name: 'test',
        //   email: 'test',
        //   phone: 'test',
        //   password: 'test',
        //   city: 'test',
        // },
      })
        .then((response) => {
          if (response.errors) {
            // Handle errors here
            console.error(response.errors);
            throw new Error(response.errors.toString());
          } else {
            // Handle successful response here
            console.log(response.data);
            return response?.data;
          }
        })
        .catch((networkError) => {
          // Handle network errors here
          console.error(networkError);
        });

      console.log('ddd', data);
      return data?.registerUser;

      // Handle the response data here
    } catch (error) {
      // Handle the error here
      console.log('error', (error as Error).message);
      return error;
    }
  };
  return { handleSubmit, loading, errorSubmit: error };
};

export default useSubmit;
