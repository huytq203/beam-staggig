import cookie from 'cookie';
import type { NextPage } from 'next';

export async function getServerSideProps(props: any) {
  const mycookie = cookie.parse((props.req && props.req.headers.cookie) || '');
  const ACCESS_TOKEN = mycookie.ACCESS_TOKEN;

  let redirect = {
    permanent: false,
    destination: '/dashboard',
  };
  if (!ACCESS_TOKEN) {
    redirect = {
      permanent: false,
      destination: '/auth/signin',
    };
  }

  return {
    redirect: redirect,
  };
}

const Home: NextPage = () => {
  return <>loading...</>;
};

export default Home;
