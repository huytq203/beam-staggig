import { ContentWrapper } from "@components/widgets";
import { PrimaryLayout } from "@components/widgets/Layouts";
import { UserRole } from "@constants/auth.constants";
import { NewsArticleList } from "@modules/news";

import { useRouter } from "next/router";
export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function NewsArticleListPage() {
  const router = useRouter();
  return (
    <PrimaryLayout>
      <ContentWrapper
        pageTitle="Danh sách tin tức"
        primaryButtonText="Tạo mới bài viết"
        onClickPrimaryButton={() => router.push("/news/articles/create")}
        allowedRoles={[
          UserRole.BEAM_ADMIN,
          UserRole.SUPER_ADMIN,
          UserRole.SALE,
        ]}
      >
        <NewsArticleList />
      </ContentWrapper>
    </PrimaryLayout>
  );
}
