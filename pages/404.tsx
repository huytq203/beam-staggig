import { Container, PrimaryLayout, PrimarySidebar } from "@components/widgets";
import { Layout } from "@douyinfe/semi-ui";
import Image from "next/image";
import notFound from "../public/img/error/404.png";
const NotFound = () => {
  return (
    <PrimaryLayout>
      <Layout className="flex-1 overflow-auto bg-slate-200">
        <Container>
          <div className="flex justify-center items-center">
            <Image src={notFound} alt="" />
          </div>
        </Container>
      </Layout>
    </PrimaryLayout>
  );
};

export default NotFound;
