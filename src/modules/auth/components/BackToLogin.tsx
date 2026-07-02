import { IconArrowLeft } from '@douyinfe/semi-icons';
import { Typography } from '@douyinfe/semi-ui';
import { useRouter } from 'next/router';

export const BackToLogin = () => {
  const { Text } = Typography;
  const router = useRouter();

  return (
    <div className='flex justify-center'>
      <Text link onClick={() => router.push('/auth/signin')} icon={<IconArrowLeft />}>
        Quay lại trang đăng nhập
      </Text>
    </div>
  );
};
