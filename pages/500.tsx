import { Container, PrimaryLayout, PrimarySidebar } from '@components/widgets';
import { Layout } from '@douyinfe/semi-ui';
import Image from 'next/image';
import internalError from '../public/img/error/500.png';
const InternalError = () => {
  return (
    <PrimaryLayout>
      <Layout className="flex-1 overflow-auto bg-slate-200">
        <Container>
          <div className="flex justify-center items-center">
            <Image src={internalError} alt="" />
          </div>
        </Container>
      </Layout>
    </PrimaryLayout>
  );
};

export default InternalError;
