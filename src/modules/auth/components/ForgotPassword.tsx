import { IconUnlock } from '@douyinfe/semi-icons';
import { Typography } from '@douyinfe/semi-ui';
import { useRouter } from 'next/router';

export const ForgotPassword = () => {
  const { Text } = Typography;
  const router = useRouter();

  return (
    <>
      <div className='flex justify-center mt-8'>
        <Text link onClick={() => router.push('/auth/forgot')} icon={<IconUnlock />}>
          Quên mật khẩu?
        </Text>
      </div>
    </>
  );
};
