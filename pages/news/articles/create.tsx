import { ContentWrapper } from "@components/widgets";
import { PrimaryLayout } from "@components/widgets/Layouts";
import { Notification } from "@douyinfe/semi-ui";
import { NewsArticleForm } from "@modules/news";
import { NewsService } from "@services/news";
import { useRouter } from "next/router";

export async function getServerSideProps(props: any) {
  return {
    props: {},
  };
}

export default function NewsArticleCreatePage() {
  const router = useRouter();

  const onCreate = async (values: any) => {
    const response = await NewsService.addNewArticle(values);
    if (response) {
      Notification.success({
        content: `Tạo mới thành công`,
        theme: "light",
      });
    }
    onCancel();
  };

  const onCancel = () => {
    router.push("/news/articles");
  };

  return (
    <PrimaryLayout breadcrumbs={["Bài viết"]}>
      <ContentWrapper pageTitle="Tạo mới tin tức">
        <NewsArticleForm onSubmit={onCreate} onCancel={onCancel} />
      </ContentWrapper>
    </PrimaryLayout>
  );
}
