import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function withCookies(
  WrappedComponent: React.ComponentType<any>,
) {
  return function Wrapper(children: React.ReactNode, props: any) {
    const router = useRouter();

    useEffect(() => {
      const token = parseCookies().token;
      const userId = parseCookies().userId;

      if (token) {
        // router.replace('/login');
        props.jwt = token;
        props.userId = userId;
      }
    }, []);

    return <WrappedComponent {...props}>{children}</WrappedComponent>;
  };
}
